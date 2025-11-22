'use client';

import React from 'react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar } from '@/app/upload/BlockToolbar';
import EditableBlock from '@/app/upload/EditableBlock';

export default function HeadingBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: BlockComponentProps<'heading'>) {
    const align = block.data.align || 'left';
    const textAlignClass =
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

    return (
        <EditableBlock>
            <BlockToolbar className="flex items-center gap-2">
                <BlockToolbar.ToolbarAlignButtons
                    onClickAction={(newAlignment) =>
                        updateBlockDataAction((d) => ({ ...d, align: newAlignment }))
                    }
                    align={align}
                />
                <BlockToolbar.ToolbarRemoveButton onClickAction={onRemoveAction} />
            </BlockToolbar>
            <input
                type="text"
                placeholder="Click to add heading..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className={`w-full text-2xl font-semibold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent ${textAlignClass}`}
            />
        </EditableBlock>
    );
}
