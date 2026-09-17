/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static output: `next build` emits ./out — no server, no runtime cost.
  output: 'export',
  // Trailing slashes keep static hosts (Cloudflare Pages, GitHub Pages, S3) happy.
  trailingSlash: true,
  images: {
    // Required for `output: 'export'`; we ship SVG/CSS art, not raster assets.
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
