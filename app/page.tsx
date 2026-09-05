import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BrandLogos } from "@/components/brand-logos"
import { ProductsCarousel } from "@/components/products-carousel"
import { CategoriesGrid } from "@/components/categories-grid"
import { MarqueeStrip } from "@/components/marquee-strip"
import { ServicesSection } from "@/components/services-section"
import { FinancingBanner } from "@/components/financing-banner"
import { ProductsSection } from "@/components/products-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AboutSection } from "@/components/about-section"
import { ShowroomSection } from "@/components/showroom-section"
import { GallerySection } from "@/components/gallery-section"
import { FAQSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import {
  getFaqs,
  getFeaturedProducts,
  getGalleryImages,
  getProductCount,
  getSiteContent,
  getSocialLinks,
} from "@/lib/data"

export const revalidate = 0

export default async function Home() {
  const [featured, productCount, gallery, faqs, content, socials] = await Promise.all([
    getFeaturedProducts(),
    getProductCount(),
    getGalleryImages(),
    getFaqs(),
    getSiteContent(),
    getSocialLinks(),
  ])

  return (
    <main className="relative bg-background text-foreground">
      <Navbar content={content} />
      <HeroSection content={content} />
      <MarqueeStrip />
      <ProductsCarousel products={featured} />
      <CategoriesGrid />
      <ServicesSection />
      <FinancingBanner />
      <ProductsSection initialTotal={productCount} />
      <TestimonialsSection />
      <BrandLogos />
      <AboutSection content={content} />
      <ShowroomSection content={content} />
      <GallerySection images={gallery} />
      <FAQSection faqs={faqs} />
      <ContactSection content={content} />
      <Footer content={content} socials={socials} />
      <WhatsAppButton phone={content.whatsapp_number || "17789998473"} />
    </main>
  )
}
