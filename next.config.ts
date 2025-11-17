import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '54321',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '54321',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api.pixelports.com',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api-eu.mixpanel.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
