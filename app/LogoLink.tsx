'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function LogoLink({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCompleteProfile = pathname === '/signup/complete-profile';

    if (isCompleteProfile) {
        return (
            <div aria-label="PixelPorts - Logo" className="cursor-default select-none">
                {children}
            </div>
        );
    }

    return (
        <Link href="/" aria-label="PixelPorts - Go to homepage">
            {children}
        </Link>
    );
}
