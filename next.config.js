/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // enables static export mode
  reactStrictMode: true,
  images: { unoptimized: true },
};
module.exports = nextConfig;