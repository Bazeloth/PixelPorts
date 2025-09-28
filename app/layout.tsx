import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'PixelPorts',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Pixelports - Showcase Your Design Journey</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-gray-50 antialiased font-sans">
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        <Link href="/" aria-label="PixelPorts - Go to homepage">
                                            PixelPorts
                                        </Link>
                                    </h1>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a
                                        href="#"
                                        className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                                    >
                                        Discover
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                    >
                                        Browse
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                    >
                                        About
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    Sign In
                                </button>
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                                    Join Pixelports
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    );
}
