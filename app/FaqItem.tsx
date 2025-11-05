'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from '@/app/Icon';

type FaqItemProps = {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggleAction?: () => void;
};

export function FaqItem({ title, children, isOpen, onToggleAction }: FaqItemProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;

    const handleClick = () => {
        if (onToggleAction) {
            onToggleAction();
        } else {
            setInternalOpen((prev) => !prev);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={handleClick}
                className={`w-full text-left px-6 py-4 flex justify-between items-center font-semibold ${open ? 'text-purple-600' : 'text-gray-900'} hover:text-purple-600 cursor-pointer`}
            >
                <span>{title}</span>
                <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>
                    <Icon icon={ChevronDown} size="md" />
                </span>
            </button>
            <div className={`px-6 pb-4 text-gray-600 ${open ? '' : 'hidden'}`}>{children}</div>
        </div>
    );
}
