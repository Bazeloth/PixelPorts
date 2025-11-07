'use client';

import React, { useRef, useState, useEffect } from 'react';
import Icon from '@/app/Icon';
import { Image as ImageIcon, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar, ToolbarRemoveButton } from '@/app/upload/BlockToolbar';
import { handleImageFile, validateImageFile } from '@/app/upload/uploadUtils';
import { ACCEPT_IMAGE_TYPES } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';
import EditableBlock from '@/app/upload/EditableBlock';

export default function CarouselBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: BlockComponentProps<'carousel'>) {
    const mainInputRef = useRef<HTMLInputElement>(null);
    const { tryReplaceBytes } = useUploadActions();

    const thumbs: string[] = block.data?.thumbnails || [];
    const thumbSizes: number[] = block.data?.thumbnailSizes || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const setMainImage = (src: string, size?: number) =>
        updateBlockDataAction((d) => ({
            ...d,
            mainImage: src,
            ...(typeof size === 'number' ? { mainImageBytes: size } : {}),
        }));

    // Keep main image always derived from the selected thumbnail
    useEffect(() => {
        if (thumbs.length > 0 && thumbs[selectedIndex]) {
            if (block.data.mainImage !== thumbs[selectedIndex]) {
                setMainImage(thumbs[selectedIndex], thumbSizes[selectedIndex]);
            }
        } else {
            if (block.data.mainImage) {
                updateBlockDataAction((d) => ({ ...d, mainImage: undefined, mainImageBytes: 0 }));
            }
        }
    }, [selectedIndex, thumbs]);

    const addThumbAt = (index: number, src: string, size: number) => {
        updateBlockDataAction((d) => {
            const thumbnails: string[] = [...(d.thumbnails || [])];
            const thumbnailSizes: number[] = [...(d.thumbnailSizes || [])];
            thumbnails[index] = src;
            thumbnailSizes[index] = size;
            return { ...d, thumbnails, thumbnailSizes };
        });

        setMainImage(src, size);
    };

    const removeThumb = (index: number) => {
        const prevSize = thumbSizes[index] || 0;
        tryReplaceBytes(prevSize, 0);

        // Compute post-removal arrays first
        const newThumbs = [...thumbs];
        const newSizes = [...thumbSizes];
        newThumbs.splice(index, 1);
        newSizes.splice(index, 1);

        // Persist changes
        updateBlockDataAction((d) => ({
            ...d,
            thumbnails: newThumbs,
            thumbnailSizes: newSizes,
        }));

        // Determine new selected index (clamp to last highest index)
        if (newThumbs.length === 0) {
            setSelectedIndex(0);
            // Clear main image if no thumbs remain
            updateBlockDataAction((d) => ({ ...d, mainImage: undefined, mainImageBytes: 0 }));
            return;
        }

        let newSelected = selectedIndex;
        if (selectedIndex >= newThumbs.length) {
            newSelected = newThumbs.length - 1; // clamp to last index
        } else if (index === selectedIndex) {
            newSelected = Math.min(index, newThumbs.length - 1); // stay at same spot (now next item)
        }

        setSelectedIndex(newSelected);
        setMainImage(newThumbs[newSelected], newSizes[newSelected]);
    };

    const onMainFile = (f?: File | null) => {
        if (!f) return;
        const err = validateImageFile(f);
        if (err) return alert(err.message);

        // If no thumbnails exist, uploading a "main" image should create the first thumbnail
        if (thumbs.length === 0) {
            const prevThumb = 0;
            if (!tryReplaceBytes(prevThumb, f.size)) return;
            handleImageFile(f, (src) => {
                addThumbAt(0, src, f.size);
                setSelectedIndex(0);
            });
            return;
        }

        // Fallback: if thumbnails already exist, just replace main image
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

    const selectThumb = (index: number) => {
        setSelectedIndex(index);
        setMainImage(thumbs[index], thumbSizes[index]);
    };

    const goToPrevious = () => {
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedIndex(newIndex);
            setMainImage(thumbs[newIndex], thumbSizes[newIndex]);
        }
    };

    const goToNext = () => {
        if (selectedIndex < thumbs.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedIndex(newIndex);
            setMainImage(thumbs[newIndex], thumbSizes[newIndex]);
        }
    };

    const hasImages = thumbs.length > 0;
    const showNavigation = hasImages && thumbs.length > 1;

    return (
        <EditableBlock>
            <BlockToolbar>
                <ToolbarRemoveButton onRemoveAction={onRemoveAction} />
            </BlockToolbar>
            <div className="space-y-4">
                {/* Main image */}
                <div className="relative group">
                    <div
                        id={`carousel-main-${block.id}`}
                        className={`border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 ${
                            !hasImages ? 'p-20 cursor-pointer' : ''
                        }`}
                        onClick={() => !hasImages && mainInputRef.current?.click()}
                    >
                        {block.data.mainImage ? (
                            <img
                                src={block.data.mainImage}
                                alt="Main"
                                className="w-full rounded-lg transition-all duration-300"
                                style={{ height: 'auto' }}
                            />
                        ) : (
                            <div>
                                <Icon
                                    icon={ImageIcon}
                                    size={48}
                                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                    ariaLabel="Upload main image"
                                />
                                <p className="text-gray-600">Click to upload image</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    {showNavigation && selectedIndex > 0 && (
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    {showNavigation && selectedIndex < thumbs.length - 1 && (
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                    )}

                    {/* Image Counter */}
                    {showNavigation && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {selectedIndex + 1} / {thumbs.length}
                        </div>
                    )}

                    <input
                        ref={mainInputRef}
                        type="file"
                        accept={ACCEPT_IMAGE_TYPES}
                        className="hidden"
                        onChange={(e) => onMainFile(e.target.files?.[0])}
                    />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 pb-2" id={`carousel-thumbnails-${block.id}`}>
                    {thumbs.map((src: string, index: number) => (
                        <div key={index} className="relative group/thumb flex-shrink-0">
                            <button
                                onClick={() => selectThumb(index)}
                                className={`w-20 h-20 rounded overflow-hidden transition-all cursor-pointer ${
                                    index === selectedIndex
                                        ? 'ring-2 ring-purple-600 ring-offset-2'
                                        : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </button>

                            {/* Delete button on hover */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeThumb(index);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity hidden group-hover/thumb:flex hover:bg-red-600 cursor-pointer"
                                aria-label="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {thumbs.length < 10 && (
                        <CarouselThumbPicker onPick={(file) => onThumbFile(thumbs.length, file)} />
                    )}
                </div>
                <p className="text-xs text-gray-500 text-center">
                    {hasImages ? `${thumbs.length} / 10 images` : 'Add up to 10 thumbnail images'}
                </p>
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
