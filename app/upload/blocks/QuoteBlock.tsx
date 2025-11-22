'use client';

import React from 'react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import TextBlock from '@/app/upload/blocks/TextBlock';

export default function QuoteBlock(props: BlockComponentProps<'quote'>) {
    return (
        <TextBlock
            {...props}
            as="textarea"
            rows={3}
            placeholder="Click to add quote..."
            inputClassName="text-lg italic text-gray-800 placeholder-gray-300 resize-none leading-relaxed"
        />
    );
}
