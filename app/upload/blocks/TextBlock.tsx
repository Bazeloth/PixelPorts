'use client';

import React from 'react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar } from '@/app/upload/BlockToolbar';
import EditableBlock from '@/app/upload/EditableBlock';

// Shared text-like block for heading, paragraph, caption, and quote
export type TextKinds = 'heading' | 'paragraph' | 'caption' | 'quote';

export type TextBlockProps<T extends TextKinds> = BlockComponentProps<T> & {
    as: 'input' | 'textarea';
    placeholder: string;
    inputClassName?: string;
    rows?: number; // when textarea
};

export default function TextBlock<T extends TextKinds>(props: TextBlockProps<T>) {
    const {
        block,
        onRemoveAction,
        updateBlockDataAction,
        as,
        placeholder,
        inputClassName = '',
        rows,
    } = props;

    const align = block.data.align || 'left';
    const textAlignClass =
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

    const commonProps = {
        placeholder,
        value: block.data.text || '',
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            updateBlockDataAction((d) => ({ ...d, text: e.target.value })),
        className: `w-full border-none focus:outline-none focus:ring-0 p-0 bg-transparent ${textAlignClass} ${inputClassName}`,
    } as const;

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

            {as === 'input' ? (
                <input type="text" {...commonProps} />
            ) : (
                <textarea rows={rows} {...commonProps} />
            )}
        </EditableBlock>
    );
}
