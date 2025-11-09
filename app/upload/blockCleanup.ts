'use client';

import { Block } from '@/lib/constants/blockTypes';
import { UploadActions } from '@/app/upload/UploadActionsContext';

export function releaseBytesForBlock(block: Block, actions: UploadActions) {
    switch (block.type) {
        case 'image': {
            const bytes = Number(block.data.imageBytes || 0);
            if (bytes) actions.releaseBytes(bytes);
            return;
        }
        case 'carousel': {
            const sizes = Array.isArray(block.data.thumbnailSizes) ? block.data.thumbnailSizes : [];
            const legacy = Number(block.data.mainImageBytes || 0);
            const bytes = sizes.reduce((a, v) => a + (Number(v) || 0), 0) + legacy;
            if (bytes) actions.releaseBytes(bytes);
            return;
        }
        case 'grid': {
            const sizes = Array.isArray(block.data.imageSizes) ? block.data.imageSizes : [];
            const bytes = sizes.reduce((a, v) => a + (Number(v) || 0), 0);
            if (bytes) actions.releaseBytes(bytes);
            return;
        }
        case 'before-after': {
            const bytes = Number(block.data.beforeBytes || 0) + Number(block.data.afterBytes || 0);
            if (bytes) actions.releaseBytes(bytes);
            return;
        }
        case 'heading':
        case 'paragraph':
            return;
    }
}
