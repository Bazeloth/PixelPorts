import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [new URL('http://localhost:54321/storage/**')],
    },
};

export default nextConfig;
