'use client';

import React from 'react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar } from '@/app/upload/BlockToolbar';
import EditableBlock from '@/app/upload/EditableBlock';

export default function ParagraphBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: BlockComponentProps<'paragraph'>) {
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
            <textarea
                rows={4}
                placeholder="Click to add paragraph..."
                value={block.data.text || ''}
                onChange={(e) => updateBlockDataAction((d) => ({ ...d, text: e.target.value }))}
                className={`w-full text-gray-700 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed ${textAlignClass}`}
            />
        </EditableBlock>
    );
}
