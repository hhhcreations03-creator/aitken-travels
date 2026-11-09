/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first: photos come out roughly a third smaller than WebP on browsers that support it.
    formats: ["image/avif", "image/webp"],
    // Site photos never change at the same URL, so let the optimiser keep them for a month.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // PGlite (local development database) ships WebAssembly and must not be bundled.
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },
};

export default nextConfig;
