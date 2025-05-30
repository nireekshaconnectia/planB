/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Suppress hydration warnings
    onDemandEntries: {
        // period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 2,
    },
    images: {
        domains: ['www.planbqa.shop', 'localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/uploads/**',
            },
        ],
    },
}

module.exports = nextConfig 