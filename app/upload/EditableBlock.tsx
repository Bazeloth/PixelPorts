'use client';

import React from 'react';

export default function EditableBlock({
    children,
    className = '',
    onClickAction,
}: {
    children: React.ReactNode;
    className?: string;
    onClickAction?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div className={`editable-block ${className}`.trim()} onClick={onClickAction}>
            {children}
        </div>
    );
}
