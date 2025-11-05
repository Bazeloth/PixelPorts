import React from 'react';
import type { LucideIcon } from 'lucide-react';

// Unified Icon wrapper to enforce consistent iconography rules across the app
// - 2px stroke, rounded caps/joins (Lucide defaults)
// - Standard optical sizes: 16 (sm), 20 (md), 24 (lg)
// - Accessible by default: aria-hidden when decorative; provide ariaLabel for informative icons
//
// Usage:
//   import { PlusIcon } from 'lucide-react';
//   <Icon icon={PlusIcon} size="sm" ariaLabel="Add" />
//   <Icon icon={PlusIcon} size={18} className="text-indigo-600" />

export type IconSize = 'sm' | 'md' | 'lg' | number;

type IconProps = {
    icon: LucideIcon;
    size?: IconSize; // default: 'md' (20px)
    className?: string;
    ariaLabel?: string; // pass to make it non-decorative
};

const sizeToPx = (size: IconSize | undefined): number => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 24;
    if (size === 'md' || size === undefined) return 20;
    return size;
};

export default function Icon({ icon: Lucide, size = 'md', className = '', ariaLabel }: IconProps) {
    const px = sizeToPx(size);
    const a11yProps = ariaLabel
        ? { role: 'img' as const, 'aria-label': ariaLabel }
        : { 'aria-hidden': true };

    return (
        <Lucide
            width={px}
            height={px}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...a11yProps}
        />
    );
}
