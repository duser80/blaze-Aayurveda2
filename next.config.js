/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        unoptimized: true,
        domains: ["cdn.dribbble.com", "images.unsplash.com", "cdn.builder.io"],
    },
};

module.exports = nextConfig;
