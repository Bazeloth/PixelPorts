import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'PixelPorts',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

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
                            {user == null ? (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={'/login'}
                                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={'/signup'}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                                    >
                                        Join Pixelports
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 4v16m8-8H4"
                                            ></path>
                                        </svg>
                                        Upload Work
                                    </button>

                                    <button className="relative text-gray-400 hover:text-gray-600 p-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 17h5l-5-5 5-5H15v10z"
                                            ></path>
                                        </svg>

                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            3
                                        </span>
                                    </button>

                                    <div className="relative ml-3">
                                        <div>
                                            <button
                                                className="bg-gray-800 flex text-sm rounded-full
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                                    alt="Profile"
                                                />
                                            </button>
                                        </div>
                                        <div
                                            className="origin-top-right absolute right-0
                                    mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                                        >
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                                <div className="font-medium">Sarah Chen</div>
                                                <div className="text-gray-500">@sarahchen</div>
                                            </div>
                                            <a
                                                href="#"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    ></path>
                                                </svg>
                                                Your Profile
                                            </a>
                                            <a
                                                href="#"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    ></path>
                                                </svg>
                                                Analytics
                                            </a>
                                            <a
                                                href="#"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    ></path>
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                Settings
                                            </a>
                                            <a
                                                href="#"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                                    ></path>
                                                </svg>
                                                Upgrade to Pro
                                            </a>
                                            <div className="border-t border-gray-200">
                                                <a
                                                    href="#"
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                >
                                                    <svg
                                                        className="w-4 h-4 mr-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                        ></path>
                                                    </svg>
                                                    Sign out
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    );
}
