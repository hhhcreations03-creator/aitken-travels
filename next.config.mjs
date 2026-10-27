/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // PGlite (local development database) ships WebAssembly and must not be bundled.
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },
};

export default nextConfig;
