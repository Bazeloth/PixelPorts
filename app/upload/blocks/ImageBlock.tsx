'use client';

import React, { useRef } from 'react';
import Icon from '@/app/Icon';
import { Image as ImageIcon } from 'lucide-react';
import { Block } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarButton, ToolbarDangerButton } from '@/app/upload/BlockToolbar';
import { handleImageFile, validateImageFile } from '@/app/upload/uploadUtils';
import { ACCEPT_IMAGE_TYPES } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';

export default function ImageBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block;
    onRemoveAction: () => void;
    updateBlockDataAction: (updater: (data: any) => any) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { tryReplaceBytes } = useUploadActions();

    const onFile = (f?: File | null) => {
        if (!f) return;
        const err = validateImageFile(f);
        if (err) {
            alert(err.message);
            return;
        }
        const prev = Number(block.data?.imageBytes || 0);
        if (!tryReplaceBytes(prev, f.size)) return;
        handleImageFile(f, (src) =>
            updateBlockDataAction((d) => ({ ...d, image: src, imageBytes: f.size }))
        );
    };

    return (
        <div className="editable-block">
            <BlockToolbar className="flex gap-2">
                <ToolbarButton
                    onClickAction={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                    }}
                >
                    Change
                </ToolbarButton>
                <ToolbarDangerButton
                    onClickAction={(e) => {
                        e.stopPropagation();
                        onRemoveAction();
                    }}
                >
                    Delete
                </ToolbarDangerButton>
            </BlockToolbar>
            {!block.data.image ? (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Icon
                        icon={ImageIcon}
                        size={48}
                        className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        ariaLabel="Upload image"
                    />
                    <p className="text-gray-600">Click to upload image</p>
                </div>
            ) : (
                <div>
                    <img src={block.data.image} alt="Image" className="w-full rounded-lg" />
                    <input
                        type="text"
                        placeholder="Add caption (optional)..."
                        value={block.data.caption || ''}
                        onChange={(e) =>
                            updateBlockDataAction((d) => ({ ...d, caption: e.target.value }))
                        }
                        className="w-full mt-3 text-sm text-gray-600 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent text-center"
                    />
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGE_TYPES}
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
            />
        </div>
    );
}
