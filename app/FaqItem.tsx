'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FaqItemProps = {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean; // controlled open state
    onToggle?: () => void; // controlled toggle handler
};

export function FaqItem({ title, children, isOpen, onToggle }: FaqItemProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;

    const handleClick = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalOpen((prev) => !prev);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={handleClick}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-gray-900 hover:text-purple-600 cursor-pointer"
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <ChevronDown />
                </svg>
            </button>
            <div className={`px-6 pb-4 text-gray-600 ${open ? '' : 'hidden'}`}>{children}</div>
        </div>
    );
}
