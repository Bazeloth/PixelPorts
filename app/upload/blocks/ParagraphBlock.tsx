'use client';

import React from 'react';
import { Block, ParagraphData, UpdateBlockDataAction } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarRemoveButton } from '@/app/upload/BlockToolbar';
import EditableBlock from '@/app/upload/EditableBlock';

export default function ParagraphBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block<'paragraph'>;
    onRemoveAction: () => void;
    updateBlockDataAction: UpdateBlockDataAction<ParagraphData>;
}) {
    return (
        <EditableBlock>
            <BlockToolbar>
                <ToolbarRemoveButton onRemoveAction={onRemoveAction} />
            </BlockToolbar>
            <textarea
                rows={4}
                placeholder="Click to add paragraph..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className="w-full text-gray-700 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
            />
        </EditableBlock>
    );
}
