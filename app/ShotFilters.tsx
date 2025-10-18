'use client';

import { useState } from 'react';

const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'uiux', label: 'UI/UX' },
    { key: 'branding', label: 'Branding' },
    { key: 'web', label: 'Web' },
    { key: 'mobile', label: 'Mobile' },
];

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export default function ShotFilters({
    defaultCategory = 'all',
    onChangeAction,
}: {
    defaultCategory?: CategoryKey;
    onChangeAction?: (key: CategoryKey) => void;
}) {
    const [active, setActive] = useState<CategoryKey>(defaultCategory);
    return (
        <div
            className="flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-200"
            role="tablist"
            aria-label="Filter projects by category"
        >
            {CATEGORIES.map((c) => (
                <button
                    key={c.key}
                    role="tab"
                    aria-selected={active === c.key}
                    onClick={() => {
                        setActive(c.key);
                        onChangeAction?.(c.key);
                    }}
                    className={
                        'px-4 py-1.5 rounded-md font-medium transition-all text-xs ' +
                        (active === c.key
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-50')
                    }
                >
                    {c.label}
                </button>
            ))}
        </div>
    );
}
