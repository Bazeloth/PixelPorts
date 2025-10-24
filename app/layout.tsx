import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/app/Header';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'PixelPorts',
    description: 'Showcase your design journey on PixelPorts.',
    openGraph: {
        title: 'PixelPorts',
        description: 'Showcase your design journey on PixelPorts.',
        url: siteUrl,
        siteName: 'PixelPorts',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'PixelPorts',
        description: 'Showcase your design journey on PixelPorts.',
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

import Providers from '@/app/providers';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-sans bg-gray-50 antialiased">
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
