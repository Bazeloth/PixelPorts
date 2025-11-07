'use client';

import React from 'react';
import { Block, HeadingData, UpdateBlockDataAction } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarRemoveButton } from '@/app/upload/BlockToolbar';
import EditableBlock from '@/app/upload/EditableBlock';

export default function HeadingBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block<'heading'>;
    onRemoveAction: () => void;
    updateBlockDataAction: UpdateBlockDataAction<HeadingData>;
}) {
    return (
        <EditableBlock>
            <BlockToolbar>
                <ToolbarRemoveButton onRemoveAction={onRemoveAction} />
            </BlockToolbar>
            <input
                type="text"
                placeholder="Click to add heading..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
            />
        </EditableBlock>
    );
}
