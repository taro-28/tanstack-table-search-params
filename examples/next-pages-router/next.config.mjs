/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@examples/lib", "tanstack-table-search-params"],
};

export default nextConfig;
