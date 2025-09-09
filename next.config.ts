import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			new URL('http://localhost:54321/storage/**'),
			new URL('https://api.pixelports.com/storage/**')
		],
	},
};

export default nextConfig;
