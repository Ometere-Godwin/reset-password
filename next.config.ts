/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // This will help with client-side only components
    appDir: true,
  },
  // Ensure proper handling of client-side components
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
