'use client';

import { BlockComponentProps } from '@/lib/constants/blockTypes';
import TextBlock from '@/app/upload/blocks/TextBlock';

export default function ParagraphBlock(props: BlockComponentProps<'paragraph'>) {
    return (
        <TextBlock
            {...props}
            as="textarea"
            rows={4}
            placeholder="Click to add paragraph..."
            inputClassName="text-gray-700 placeholder-gray-300 resize-none leading-relaxed"
        />
    );
}
