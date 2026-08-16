#!/usr/bin/env node
/**
 * Import the ATW (Autoworks Wheel & Tire Distributors Canada) CSV feed into
 * Supabase products.
 *
 * Reads four files from data/:
 *   ATW_Inventory.csv                    master list — stock + pricing, per branch
 *   ATW_INVENTORY_SFTP_SHARE_WHEELS.csv  wheel specs + images, keyed by ITEM
 *   ATW_INVENTORY_SFTP_SHARE_TIRES.csv   tire specs + images, keyed by ITEM
 *   ATW_INVENTORY_SFTP_SHARE_OTHER.csv   accessory/hardware specs + images
 *
 * The inventory file lists every item once per branch (Edmonton, Calgary), so
 * rows are collapsed to one product per item_number with stock summed. Spec
 * files supply the name, attributes and images; they join on item_number = ITEM.
 *
 * Prices are deliberately NOT imported. The feed carries Dealer_Price
 * (wholesale cost) alongside MSL_Price, and this project never stores or
 * exposes prices to customers — same policy as import-techfeed.mjs.
 *
 * Usage:
 *   node scripts/import-atw.mjs            # upsert by sku
 *   node scripts/import-atw.mjs --dry-run  # report what would change, write nothing
 */

import { createClient } from "@supabase/supabase-js"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const DATA = path.join(ROOT, "data")
const BATCH_SIZE = 400

const dryRun = process.argv.includes("--dry-run")

/* ------------------------------------------------------------------ csv --- */

function parseCsv(text) {
  const rows = []
  let row = []
  let cur = ""
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"'
          i++
        } else quoted = false
      } else cur += ch
    } else if (ch === '"') quoted = true
    else if (ch === ",") {
      row.push(cur)
      cur = ""
    } else if (ch === "\r") {
      /* ignore */
    } else if (ch === "\n") {
      row.push(cur)
      rows.push(row)
      row = []
      cur = ""
    } else cur += ch
  }
  if (cur || row.length) {
    row.push(cur)
    rows.push(row)
  }

  const header = rows.shift()
  return rows
    .filter((r) => r.length > 1)
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])))
}

function readCsv(filename) {
  const file = path.join(DATA, filename)
  if (!existsSync(file)) {
    throw new Error(`${filename} not found in data/ — place the ATW feed there first`)
  }
  return parseCsv(readFileSync(file, "utf8"))
}

/* -------------------------------------------------------------- mapping --- */

// producttype -> category, learned from the items that do appear in a spec file.
const WHEEL_TYPES = new Set(["T11", "T12"])
const TIRE_TYPES = new Set(["1", "2", "3", "1W", "2W", "3W", "1AW", "2AW", "3AW", "2WPS", "RF"])
const ACCESSORY_TYPES = new Set(["AMF", "1C", "T2", "T3", "T1", "GRILLE", "APPAREL", "WEIGHTS", "12", "13"])

function categoryFromProductType(type) {
  const t = (type || "").toUpperCase()
  if (WHEEL_TYPES.has(t)) return "Wheels"
  if (TIRE_TYPES.has(t)) return "Tires"
  if (ACCESSORY_TYPES.has(t)) return "Accessories"
  return "Accessories"
}

// "ACCESSORIES : CENTER CAPS" -> "Accessories · CENTER CAPS", matching the
// ` · ` sub-category convention already used by the TechFeed import.
function categoryFromClass(raw) {
  if (!raw) return "Accessories"
  const [head, ...rest] = raw.split(":").map((s) => s.trim())
  const family = head.charAt(0) + head.slice(1).toLowerCase()
  const sub = rest.join(" ").trim()
  return sub ? `${family} · ${sub}` : family
}

function firstImage(...candidates) {
  for (const value of candidates) {
    if (value && /^https?:\/\//i.test(value)) return value
  }
  return null
}

function joinParts(...parts) {
  return parts.filter(Boolean).join(" · ") || null
}

/* ----------------------------------------------------------------- main --- */

function getEnv(name) {
  return process.env[name] || process.env[name.replace("NEXT_PUBLIC_", "")]
}

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local")
  if (!existsSync(file)) return
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const i = line.indexOf("=")
    if (i < 1 || line.trimStart().startsWith("#")) continue
    const key = line.slice(0, i).trim()
    if (!process.env[key]) process.env[key] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "")
  }
}

function build() {
  const inventory = readCsv("ATW_Inventory.csv")
  const wheels = readCsv("ATW_INVENTORY_SFTP_SHARE_WHEELS.csv")
  const tires = readCsv("ATW_INVENTORY_SFTP_SHARE_TIRES.csv")
  const other = readCsv("ATW_INVENTORY_SFTP_SHARE_OTHER.csv")

  const wheelSpec = new Map(wheels.map((r) => [r.ITEM, r]))
  const tireSpec = new Map(tires.map((r) => [r.ITEM, r]))
  const otherSpec = new Map(other.map((r) => [r.ITEM, r]))

  // Excel turns long numeric item numbers into "1.0102E+12". Recover them by
  // matching the description against the spec sheets, which keep the full value.
  const byDescription = new Map()
  for (const spec of [tires, wheels, other]) {
    for (const r of spec) {
      const key = (r.Description || "").trim().toLowerCase()
      if (key && !byDescription.has(key)) byDescription.set(key, r.ITEM)
    }
  }
  const canonicalItem = (row) => {
    const item = row.item_number
    if (!/^\d(\.\d+)?E\+\d+$/i.test(item)) return item
    return byDescription.get((row.description || "").trim().toLowerCase()) || item
  }

  // Collapse the per-branch inventory rows into one record per item.
  const stock = new Map()
  for (const row of inventory) {
    if (!row.item_number) continue
    const item = canonicalItem(row)
    const prev = stock.get(item)
    const qty = (prev?.quantity ?? 0) + (parseInt(row.quantity, 10) || 0)
    stock.set(item, {
      item,
      quantity: qty,
      manufacturer: prev?.manufacturer || row.manufacturer,
      brand: prev?.brand || row.brand,
      model: prev?.model || row.model,
      size: prev?.size || row.size,
      description: prev?.description || row.description,
      producttype: prev?.producttype || row.producttype,
    })
  }

  const items = new Set([...stock.keys(), ...wheelSpec.keys(), ...tireSpec.keys(), ...otherSpec.keys()])
  const products = []
  const stats = { wheels: 0, tires: 0, accessories: 0, withImage: 0, noImage: 0, inStock: 0, specLess: 0 }
  let order = 0

  for (const item of items) {
    const inv = stock.get(item)
    const w = wheelSpec.get(item)
    const t = tireSpec.get(item)
    const o = otherSpec.get(item)

    let category
    let name
    let description
    let size = null
    let width = null
    let profile = null
    let image_url = null

    if (w) {
      category = "Wheels"
      name = w.Description || inv?.description || item
      const bolt = [w.BOLTPATTERN1METRIC, w.BOLTPATTERN2METRIC, w.BOLTPATTERN3METRIC]
        .filter((b) => b && b.toLowerCase() !== "blank")
        .join("/")
      description = joinParts(
        w.Brand,
        w.FINISH,
        bolt ? `Bolt ${bolt}` : "",
        w.OFFSET ? `ET${w.OFFSET}` : "",
        w.HUBBOREMETRIC ? `Bore ${w.HUBBOREMETRIC}` : "",
      )
      size = w.WHEELDIAMETER && w.WHEELWIDTH ? `${w.WHEELDIAMETER}x${w.WHEELWIDTH}` : w.WHEELDIAMETER || null
      width = w.WHEELWIDTH || null
      profile = w.OFFSET || null
      image_url = firstImage(w.Image1, w.Image2)
    } else if (t) {
      category = "Tires"
      name = t.Description || inv?.description || item
      const rating = [t.LOADINDEX, t.SPEEDRATING].filter(Boolean).join("")
      description = joinParts(t.Brand, t.Model, rating, t.SIDEWALL, t.RUNFLAT === "Yes" ? "Run-flat" : "")
      size = t.Size || null
      width = t.SECTIONWIDTH || null
      profile = rating || null
      image_url = firstImage(t.Image1, t.Image2, t.Image3)
    } else if (o) {
      category = categoryFromClass(o.Class)
      name = o.Description || inv?.description || item
      description = null
      image_url = firstImage(o.Image1, o.Image2)
    } else {
      // In the inventory file but with no spec sheet — name and category come
      // from the inventory row alone, and there is no image available.
      category = categoryFromProductType(inv?.producttype)
      name = inv?.description || item
      description = joinParts(inv?.manufacturer, inv?.brand, inv?.model)
      size = inv?.size || null
      stats.specLess++
    }

    if (category === "Wheels") stats.wheels++
    else if (category === "Tires") stats.tires++
    else stats.accessories++
    if (image_url) stats.withImage++
    else stats.noImage++
    if ((inv?.quantity ?? 0) > 0) stats.inStock++

    products.push({
      sku: item,
      name: name.slice(0, 300),
      category,
      description,
      size,
      width,
      profile,
      image_url,
      price: null, // never imported — see file header
      rating: 5,
      reviews_count: 0,
      is_featured: false,
      is_active: true,
      display_order: 0,
    })
  }

  // The catalog sorts on display_order, so keep products that have a picture at
  // the front — otherwise the imageless rows fill the first pages with "NO
  // IMAGE" placeholders. Imageless rows are parked above IMAGELESS_BASE so they
  // stay last no matter what else is in the table.
  const IMAGELESS_BASE = 1_000_000
  products.sort((a, b) => {
    const byImage = (a.image_url ? 0 : 1) - (b.image_url ? 0 : 1)
    return byImage !== 0 ? byImage : a.sku.localeCompare(b.sku)
  })
  for (const product of products) {
    product.display_order = product.image_url ? order++ : IMAGELESS_BASE + order++
  }

  return { products, stats }
}

async function main() {
  loadEnvLocal()
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY")
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

  const { products, stats } = build()
  console.log(`parsed ${products.length} unique products from the ATW feed`)
  console.log(
    `  wheels ${stats.wheels} · tires ${stats.tires} · accessories ${stats.accessories}\n` +
      `  with image ${stats.withImage} · without ${stats.noImage} · in stock ${stats.inStock} · no spec sheet ${stats.specLess}`,
  )

  if (dryRun) {
    console.log("\n--dry-run: nothing written")
    for (const want of ["Wheels", "Tires", "Accessories"]) {
      const sample = products.find((p) => p.category.startsWith(want) && p.image_url)
      console.log(`\n--- ${want} ---`)
      console.log(JSON.stringify(sample, null, 2))
    }
    return
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  let written = 0
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from("products").upsert(batch, { onConflict: "sku" })
    if (error) throw new Error(`upsert failed at row ${i}: ${error.message}`)
    written += batch.length
    if (written % 2000 < BATCH_SIZE) console.log(`  upserted ${written}/${products.length}`)
  }
  console.log(`done — upserted ${written} products`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
