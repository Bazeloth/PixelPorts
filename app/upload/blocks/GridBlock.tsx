'use client';

import React from 'react';
import Icon from '@/app/Icon';
import { Plus } from 'lucide-react';
import { Block, GridData, UpdateBlockDataAction } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarRemoveButton } from '@/app/upload/BlockToolbar';
import { handleImageFile, validateImageFile } from '@/app/upload/uploadUtils';
import { ACCEPT_IMAGE_TYPES } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';
import EditableBlock from '@/app/upload/EditableBlock';

export default function GridBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block<'grid'>;
    onRemoveAction: () => void;
    updateBlockDataAction: UpdateBlockDataAction<GridData>;
}) {
    const { tryReplaceBytes } = useUploadActions();

    const setGridAt = (index: number, src: string, size: number) =>
        updateBlockDataAction((d) => {
            const images: string[] = [...(d.images || [])];
            const imageSizes: number[] = [...(d.imageSizes || [])];
            images[index] = src;
            imageSizes[index] = size;
            return { ...d, images, imageSizes };
        });

    const onGridFile = (index: number, f?: File | null) => {
        if (!f) return;
        const err = validateImageFile(f);
        if (err) return alert(err.message);
        const prev = Number(block.data?.imageSizes?.[index] || 0);
        if (!tryReplaceBytes(prev, f.size)) return;
        handleImageFile(f, (src) => setGridAt(index, src, f.size));
    };
    const images: string[] = block.data?.images || [];

    return (
        <EditableBlock>
            <BlockToolbar>
                <ToolbarRemoveButton onRemoveAction={onRemoveAction} />
            </BlockToolbar>
            <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() =>
                            document
                                .getElementById(`grid-input-${block.id}-${i}`)
                                ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                        }
                    >
                        {images[i] ? (
                            <img
                                src={images[i]}
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                alt={`Grid ${i + 1}`}
                            />
                        ) : (
                            <div>
                                <Icon
                                    icon={Plus}
                                    size={20}
                                    className="w-5 h-5 text-gray-400 mx-auto mb-1"
                                    ariaLabel="Add image"
                                />
                                <p className="text-xs text-gray-500">
                                    Image {i + 1}
                                    {i >= 2 ? ' (optional)' : ''}
                                </p>
                            </div>
                        )}
                        <input
                            id={`grid-input-${block.id}-${i}`}
                            type="file"
                            accept={ACCEPT_IMAGE_TYPES}
                            className="hidden"
                            onChange={(e) => onGridFile(i, e.target.files?.[0])}
                        />
                    </div>
                ))}
            </div>
        </EditableBlock>
    );
}
