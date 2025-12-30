'use client';

import Link from 'next/link';
import { Container } from '@/app/Container';
import Icon from '@/app/Icon';
import { CompassIcon, HomeIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center bg-gray-50">
            <Container className="text-center py-20">
                <div className="relative inline-block mb-8">
                    <div className="relative bg-white p-6 rounded-2xl border border-neutral-200">
                        <Icon
                            icon={CompassIcon}
                            size={64}
                            className="text-indigo-600"
                            ariaLabel="Lost compass"
                        />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tighter">
                    Something's missing
                </h1>

                <h2 className="text-xl font-medium text-neutral-600 mb-8 max-w-md mx-auto">
                    We couldn't find the page you're looking for. It might have been moved or
                    deleted.
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        <Icon icon={HomeIcon} size="sm" />
                        Back to Homepage
                    </Link>
                </div>

                <div className="mt-16 pt-8 border-t border-neutral-200">
                    <p className="text-sm text-neutral-400 font-medium italic">
                        "Not all those who wander are lost, but they might be looking for this
                        page."
                    </p>
                </div>
            </Container>
        </main>
    );
}
