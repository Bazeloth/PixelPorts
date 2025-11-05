'use client';

import React from 'react';
import { Block } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarDangerButton } from '@/app/upload/BlockToolbar';

export default function HeadingBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block;
    onRemoveAction: () => void;
    updateBlockDataAction: (updater: (data: any) => any) => void;
}) {
    return (
        <div className="editable-block">
            <BlockToolbar>
                <ToolbarDangerButton onClickAction={() => onRemoveAction()}>
                    Delete
                </ToolbarDangerButton>
            </BlockToolbar>
            <input
                type="text"
                placeholder="Click to add heading..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
            />
        </div>
    );
}
