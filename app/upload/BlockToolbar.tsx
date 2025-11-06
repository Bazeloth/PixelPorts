'use client';

import React from 'react';

export function BlockToolbar({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`block-toolbar mb-2 ${className}`}>{children}</div>;
}

export function ToolbarButton({
    onClickAction,
    children,
}: {
    onClickAction: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClickAction}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
            {children}
        </button>
    );
}

export function ToolbarDangerButton({
    onClickAction,
    children,
}: {
    onClickAction: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClickAction}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
        >
            {children}
        </button>
    );
}

export function ToolbarRemoveButton({
    onRemoveAction,
}: {
    onRemoveAction: () => void;
}) {
    return (
        <button
            onClick={() => onRemoveAction()}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
        >
            Remove
        </button>
    );
}
