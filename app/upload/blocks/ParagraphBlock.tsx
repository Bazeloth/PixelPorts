'use client';

import React from 'react';
import { Block } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarDangerButton } from '@/app/upload/BlockToolbar';

export default function ParagraphBlock({
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
                    Remove
                </ToolbarDangerButton>
            </BlockToolbar>
            <textarea
                rows={4}
                placeholder="Click to add paragraph..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className="w-full text-gray-700 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
            />
        </div>
    );
}
