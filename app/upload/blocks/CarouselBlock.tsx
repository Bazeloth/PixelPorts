'use client';

import React, { useRef } from 'react';
import Icon from '@/app/Icon';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { Block } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarRemoveButton } from '@/app/upload/BlockToolbar';
import { handleImageFile, validateImageFile } from '@/app/upload/uploadUtils';
import { ACCEPT_IMAGE_TYPES } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';
import EditableBlock from '@/app/upload/EditableBlock';

export default function CarouselBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block;
    onRemoveAction: () => void;
    updateBlockDataAction: (updater: (data: any) => any) => void;
}) {
    const mainInputRef = useRef<HTMLInputElement>(null);
    const { tryReplaceBytes } = useUploadActions();

    const setMainImage = (src: string, size?: number) =>
        updateBlockDataAction((d) => ({
            ...d,
            mainImage: src,
            ...(typeof size === 'number' ? { mainImageBytes: size } : {}),
        }));
    const addThumbAt = (index: number, src: string, size: number) =>
        updateBlockDataAction((d) => {
            const thumbnails: string[] = [...(d.thumbnails || [])];
            const thumbnailSizes: number[] = [...(d.thumbnailSizes || [])];
            thumbnails[index] = src;
            thumbnailSizes[index] = size;
            return { ...d, thumbnails, thumbnailSizes };
        });

    const onMainFile = (f?: File | null) => {
        if (!f) return;
        const err = validateImageFile(f);
        if (err) return alert(err.message);
        const prev = Number(block.data?.mainImageBytes || 0);
        if (!tryReplaceBytes(prev, f.size)) return;
        handleImageFile(f, (src) => setMainImage(src, f.size));
    };
    const onThumbFile = (index: number, f?: File | null) => {
        if (!f) return;
        const err = validateImageFile(f);
        if (err) return alert(err.message);
        const prev = Number(block.data?.thumbnailSizes?.[index] || 0);
        if (!tryReplaceBytes(prev, f.size)) return;
        handleImageFile(f, (src) => addThumbAt(index, src, f.size));
    };

    const thumbs: string[] = block.data?.thumbnails || [];

    return (
        <EditableBlock>
            <BlockToolbar>
                <ToolbarRemoveButton onRemoveAction={onRemoveAction} />
            </BlockToolbar>
            <div className="space-y-4">
                {/* Main image */}
                <div className="relative">
                    <div
                        id={`carousel-main-${block.id}`}
                        className="border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 cursor-pointer"
                        onClick={() => mainInputRef.current?.click()}
                    >
                        {block.data.mainImage ? (
                            <img
                                src={block.data.mainImage}
                                alt="Main"
                                className="w-full rounded-lg"
                            />
                        ) : (
                            <>
                                <Icon
                                    icon={ImageIcon}
                                    size={48}
                                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                    ariaLabel="Upload main image"
                                />
                                <p className="text-gray-600">Click to upload image</p>
                            </>
                        )}
                    </div>
                    <input
                        ref={mainInputRef}
                        type="file"
                        accept={ACCEPT_IMAGE_TYPES}
                        className="hidden"
                        onChange={(e) => onMainFile(e.target.files?.[0])}
                    />
                </div>

                {/* Thumbnails */}
                <div
                    className="flex gap-2 overflow-x-auto pb-2"
                    id={`carousel-thumbnails-${block.id}`}
                >
                    {thumbs.map((src: string, index: number) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-20 h-20 rounded overflow-hidden"
                        >
                            <img
                                src={src}
                                className="w-full h-full object-cover rounded cursor-pointer"
                                onClick={() => setMainImage(src)}
                                alt={`Thumb ${index + 1}`}
                            />
                        </div>
                    ))}
                    {thumbs.length < 10 && (
                        <CarouselThumbPicker onPick={(file) => onThumbFile(thumbs.length, file)} />
                    )}
                </div>
                <p className="text-xs text-gray-500 text-center">Add up to 10 thumbnail images</p>
            </div>
        </EditableBlock>
    );
}

function CarouselThumbPicker({ onPick }: { onPick: (file?: File | null) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div
            className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-purple-600 flex items-center justify-center bg-gray-50"
            onClick={() => inputRef.current?.click()}
        >
            <Icon
                icon={Plus}
                size={20}
                className="w-6 h-6 text-gray-400"
                ariaLabel="Add thumbnail"
            />
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_IMAGE_TYPES}
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
            />
        </div>
    );
}
