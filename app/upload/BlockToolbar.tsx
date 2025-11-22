'use client';

import React from 'react';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { BlockTypeAlignment } from '@/lib/constants/blockTypes';

export function BlockToolbar({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`block-toolbar relative z-10 mb-2 ${className}`}>{children}</div>;
}

function ToolbarButton({
    onClickAction,
    children,
    isDestructive = false,
}: {
    onClickAction: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    isDestructive?: boolean;
}) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClickAction(e);
            }}
            className={
                !isDestructive
                    ? 'px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50'
                    : 'px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600'
            }
        >
            {children}
        </button>
    );
}

function ToolbarIconButton({
    onClickAction,
    children,
    active = false,
    ariaLabel,
}: {
    onClickAction: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    active?: boolean;
    ariaLabel?: string;
}) {
    const base = 'p-1.5 rounded transition-colors hover:bg-gray-100';
    const tone = active ? 'bg-gray-100 text-indigo-600' : 'text-gray-600';

    return (
        <button
            type={'button'}
            onClick={(e) => {
                e.stopPropagation();
                onClickAction(e);
            }}
            className={`${base} ${tone}`}
            aria-pressed={active}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}

function ToolbarIconGroup<T extends string>({
    value,
    onChange,
    items,
    ariaLabel,
}: {
    value: T;
    onChange: (v: T) => void;
    items: Array<{ value: T; label: string; Icon: React.ComponentType<{ size?: number }> }>;
    ariaLabel: string;
}) {
    return (
        <div
            className={`flex items-center gap-1 border border-gray-300 rounded-lg p-1 bg-white`}
            role="group"
            aria-label={ariaLabel}
        >
            {items.map(({ value: v, Icon, label }) => (
                <ToolbarIconButton
                    key={v}
                    onClickAction={() => onChange(v)}
                    active={value === v}
                    ariaLabel={label}
                >
                    <Icon size={16} />
                </ToolbarIconButton>
            ))}
        </div>
    );
}

BlockToolbar.ToolbarChangeButton = function ToolbarChangeButton({
    onClickAction,
}: {
    onClickAction: () => void;
}) {
    return <ToolbarButton onClickAction={onClickAction}>Change</ToolbarButton>;
};

BlockToolbar.ToolbarClearButton = function ToolbarClearButton({
    onClickAction,
}: {
    onClickAction: () => void;
}) {
    return <ToolbarButton onClickAction={onClickAction}>Clear</ToolbarButton>;
};

BlockToolbar.ToolbarRemoveButton = function ToolbarRemoveButton({
    onClickAction,
}: {
    onClickAction: () => void;
}) {
    return (
        <ToolbarButton onClickAction={onClickAction} isDestructive={true}>
            Remove
        </ToolbarButton>
    );
};

const ALIGN_OPTIONS: Array<{
    value: BlockTypeAlignment;
    Icon: React.ComponentType<{ size?: number; className?: string }>; // Lucide icon type
    label: string; // for screen readers
}> = [
    { value: 'left', Icon: AlignLeft, label: 'Align left' },
    { value: 'center', Icon: AlignCenter, label: 'Align center' },
    { value: 'right', Icon: AlignRight, label: 'Align right' },
];

BlockToolbar.ToolbarAlignButtons = function ToolbarAlignButtons({
    align,
    onClickAction,
}: {
    align: BlockTypeAlignment;
    onClickAction: (align: BlockTypeAlignment) => void;
}) {
    return (
        <ToolbarIconGroup
            value={align}
            onChange={onClickAction}
            ariaLabel="Text alignment"
            items={ALIGN_OPTIONS}
        />
    );
};
