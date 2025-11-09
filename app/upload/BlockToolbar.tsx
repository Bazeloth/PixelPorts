'use client';

import React from 'react';

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
        <ToolbarButton onClickAction={() => onClickAction()} isDestructive={true}>
            Remove
        </ToolbarButton>
    );
};
