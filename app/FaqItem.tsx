'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqItem({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-gray-900 hover:text-purple-600 cursor-pointer"
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <ChevronDown />
                </svg>
            </button>
            <div className={`px-6 pb-4 text-gray-600 ${isOpen ? '' : 'hidden'}`}>{children}</div>
        </div>
    );
}
