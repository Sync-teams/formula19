/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "media.wheelpros.com" },
      { protocol: "https", hostname: "assets.wheelpros.com" },
      { protocol: "https", hostname: "images.wheelpros.com" },
      { protocol: "https", hostname: "5129608.app.netsuite.com" },
      { protocol: "https", hostname: "www.canadacustomautoworks.com" },
      { protocol: "https", hostname: "canadacustomautoworks.com" },
    ],
  },
}

export default nextConfig
