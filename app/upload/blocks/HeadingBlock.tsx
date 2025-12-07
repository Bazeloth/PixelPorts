'use client';

import { BlockComponentProps } from '@/lib/constants/blockTypes';
import TextBlock from '@/app/upload/blocks/TextBlock';

export default function HeadingBlock(props: BlockComponentProps<'heading'>) {
    return (
        <TextBlock
            {...props}
            as="input"
            placeholder="Click to add heading..."
            inputClassName="text-2xl font-semibold text-gray-900 placeholder-gray-300"
        />
    );
}
