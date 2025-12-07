'use client';

import { BlockComponentProps } from '@/lib/constants/blockTypes';
import TextBlock from '@/app/upload/blocks/TextBlock';

export default function CaptionBlock(props: BlockComponentProps<'caption'>) {
    return (
        <TextBlock
            {...props}
            as="input"
            placeholder="Click to add caption..."
            inputClassName="text-sm text-gray-500 italic placeholder-gray-300"
        />
    );
}
