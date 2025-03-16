/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Add basePath if your site is not hosted at the root
  // basePath: '/your-repo-name',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

