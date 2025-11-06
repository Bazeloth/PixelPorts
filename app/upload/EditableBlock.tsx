'use client';

import React from 'react';

export default function EditableBlock({
    children,
    className = '',
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div className={`editable-block ${className}`.trim()} onClick={onClick}>
            {children}
        </div>
    );
}
