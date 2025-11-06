'use client';

import React, { useCallback, useRef } from 'react';
import Icon from '@/app/Icon';
import {
    Image as ImageIcon,
    Plus,
    Heading1,
    Text,
    LayoutGrid,
    ArrowLeftRight,
    X,
    LucideIcon,
} from 'lucide-react';
import {
    MAX_BLOCKS,
    UploadActionsProvider,
    useUploadActions,
} from '@/app/upload/UploadActionsContext';
import { ACCEPT_IMAGE_TYPES, MAX_TOTAL_BYTES } from '@/app/upload/uploadPolicy';
import { validateImageFile } from '@/app/upload/uploadUtils';
import { Block, BlockType, blockTypes } from '@/lib/constants/blockTypes';
import HeadingBlock from '@/app/upload/blocks/HeadingBlock';
import ParagraphBlock from '@/app/upload/blocks/ParagraphBlock';
import ImageBlock from '@/app/upload/blocks/ImageBlock';
import CarouselBlock from '@/app/upload/blocks/CarouselBlock';
import GridBlock from '@/app/upload/blocks/GridBlock';
import BeforeAfterBlock from '@/app/upload/blocks/BeforeAfterBlock';
import { Container } from '@/app/Container';

function UploadShotPage() {
    const uploadActions = useUploadActions();
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

    const triggerThumbnailUpload = () => {
        thumbnailInputRef.current?.click();
    };

    const handleThumbnailUpload = useCallback((file?: File | null) => {
        if (!file) return;

        const err = validateImageFile(file);
        if (err) {
            alert(err.message);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadActions.setThumbnail(String(e.target?.result || ''), file.size);
        };
        reader.readAsDataURL(file);
    }, []);

    const removeBlock = useCallback((id: string) => {
        // release any bytes this block holds before removing
        const blk = uploadActions.blocks.find((b) => b.id === id);
        if (blk) {
            const d = blk.data || {};
            let bytes = 0;
            bytes += Number(d.imageBytes || 0);
            bytes += Number(d.mainImageBytes || 0);
            if (Array.isArray(d.thumbnailSizes))
                bytes += d.thumbnailSizes.reduce((a: number, v: number) => a + (Number(v) || 0), 0);
            if (Array.isArray(d.imageSizes))
                bytes += d.imageSizes.reduce((a: number, v: number) => a + (Number(v) || 0), 0);
            bytes += Number(d.beforeBytes || 0);
            bytes += Number(d.afterBytes || 0);
            if (bytes) uploadActions.releaseBytes(bytes);
        }
        uploadActions.setBlocks((prev) => prev.filter((b) => b.id !== id));
    }, []);

    const updateBlockData = useCallback((id: string, updater: (data: any) => any) => {
        uploadActions.setBlocks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, data: updater({ ...(b.data || {}) }) } : b))
        );
    }, []);

    return (
        <div className="bg-gray-50">
            {/* Two-column layout */}
            <Container as="main" className="flex">
                {/* Left - Live preview */}
                <div className="flex-1 bg-white border-r border-gray-200 p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-2">
                                Live preview - Click to edit
                            </p>
                            <p className="text-xs text-gray-400">
                                Images will be centered and display at their natural size (max 900px
                                wide)
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Title */}
                            <div className="editable-block">
                                <input
                                    type="text"
                                    placeholder="Click to add title..."
                                    value={uploadActions.title}
                                    onChange={(e) => uploadActions.setTitle(e.target.value)}
                                    className="w-full text-4xl font-bold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
                                />
                            </div>

                            {/* Thumbnail Image */}
                            <div className="editable-block" onClick={triggerThumbnailUpload}>
                                <div className="block-toolbar hidden md:flex"></div>
                                {!uploadActions.thumbnailSrc ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center bg-gray-50">
                                        <Icon
                                            icon={ImageIcon}
                                            size={64}
                                            className="w-16 h-16 text-gray-400 mx-auto mb-3"
                                            ariaLabel="Upload image"
                                        />
                                        <p className="text-gray-600 font-medium">
                                            Click to upload image
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            This will appear in feeds and on your shot page
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <img
                                            src={uploadActions.thumbnailSrc}
                                            alt="Shot image"
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                )}
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept={ACCEPT_IMAGE_TYPES}
                                    className="hidden"
                                    onChange={(e) => handleThumbnailUpload(e.target.files?.[0])}
                                />
                            </div>

                            {/* Description */}
                            <div className="editable-block">
                                <textarea
                                    rows={3}
                                    placeholder="Click to add description (optional)..."
                                    value={uploadActions.description}
                                    onChange={(e) => uploadActions.setDescription(e.target.value)}
                                    className="w-full text-lg text-gray-700 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none"
                                />
                            </div>

                            {/* Content blocks */}
                            <div className="space-y-8">
                                {uploadActions.blocks.map((block) => (
                                    <PreviewBlock
                                        key={block.id}
                                        block={block}
                                        onRemoveAction={() => removeBlock(block.id)}
                                        updateBlockDataAction={(u) => updateBlockData(block.id, u)}
                                    />
                                ))}

                                {uploadActions.blocks.length === 0 ? (
                                    <div
                                        id="add-block-prompt"
                                        className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg"
                                    >
                                        <Icon
                                            icon={Plus}
                                            size={48}
                                            className="w-12 h-12 text-gray-300 mx-auto mb-3"
                                            ariaLabel="Add"
                                        />
                                        <p className="text-gray-400">
                                            Add content blocks from the right panel
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Controls */}
                <div className="w-96 sticky top-22 bg-gray-50 pl-6 pt-6 self-start">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Shot details</h2>

                    {/* Category */}
                    <div className="mb-6">
                        <label
                            htmlFor="category-input"
                            className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category-input"
                            value={uploadActions.category}
                            onChange={(e) => uploadActions.setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 bg-white"
                        >
                            <option value="">Select a category</option>
                            <option value="ui-ux">UI/UX</option>
                            <option value="web">Web Design</option>
                            <option value="mobile">Mobile App</option>
                            <option value="branding">Branding</option>
                            <option value="illustration">Illustration</option>
                            <option value="graphic-design">Graphic Design</option>
                            <option value="product-design">Product Design</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-300 my-6" />

                    {/* Total upload size UI */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Total upload size</span>
                            <span className="font-semibold text-gray-900">
                                <span id="total-size">
                                    {(uploadActions.totalBytes / (1024 * 1024)).toFixed(1)}
                                </span>{' '}
                                / {Math.floor(MAX_TOTAL_BYTES / (1024 * 1024))} MB
                            </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                id="size-progress"
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                    width: `${Math.min(100, Math.round((uploadActions.totalBytes / MAX_TOTAL_BYTES) * 100))}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-300 my-6" />

                    {/* Add Content Blocks */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">Content blocks</h3>
                            <span className="text-xs text-gray-500">
                                <span id="block-count">{uploadActions.blockCount}</span>/
                                {MAX_BLOCKS}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">
                            Add blocks to showcase your process and thinking
                        </p>

                        <div className="space-y-2">
                            <SidebarButton
                                label="Heading"
                                onClick={() => uploadActions.addBlock('heading')}
                                icon={Heading1}
                            />
                            <SidebarButton
                                label="Paragraph"
                                onClick={() => uploadActions.addBlock('paragraph')}
                                icon={Text}
                            />
                            <SidebarButton
                                label="Image"
                                onClick={() => uploadActions.addBlock('image')}
                                icon={ImageIcon}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => uploadActions.addBlock('carousel')}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors text-left"
                                >
                                    <Icon
                                        icon={ImageIcon}
                                        size="md"
                                        className="text-gray-600"
                                        ariaLabel="Carousel"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Carousel
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        1 main + thumbnails
                                    </span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => uploadActions.addBlock('grid')}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors text-left"
                                >
                                    <Icon
                                        icon={LayoutGrid}
                                        size="md"
                                        className="text-gray-600"
                                        ariaLabel="Grid gallery"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Grid gallery
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        2-4 images
                                    </span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => uploadActions.addBlock('before-after')}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors text-left"
                                >
                                    <Icon
                                        icon={ArrowLeftRight}
                                        size="md"
                                        className="text-gray-600"
                                        ariaLabel="Before/After"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Before/After
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        Slider comparison
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active blocks */}
                    {uploadActions.blocks.length > 0 && (
                        <div id="blocks-list">
                            <div className="border-t border-gray-300 pt-4 mb-3">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Active blocks
                                </h3>
                            </div>
                            <div id="blocks-container" className="space-y-2">
                                {uploadActions.blocks.map((b) => (
                                    <div
                                        key={b.id}
                                        className="bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {labelFor(b.type)}
                                        </span>
                                        <button
                                            onClick={() => removeBlock(b.id)}
                                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                                            aria-label="Delete block"
                                        >
                                            <Icon
                                                icon={X}
                                                size={16}
                                                className="w-4 h-4"
                                                ariaLabel="Delete block"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default function UploadPage() {
    return (
        <UploadActionsProvider>
            <UploadShotPage />
        </UploadActionsProvider>
    );
}

function labelFor(t: BlockType) {
    return blockTypes[t];
}

function SidebarButton({
    label,
    onClick,
    icon: IconComp,
}: {
    label: string;
    onClick: () => void;
    icon: LucideIcon;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors text-left"
        >
            <Icon icon={IconComp} size="md" className="text-gray-600" ariaLabel={label} />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </button>
    );
}

function PreviewBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: {
    block: Block;
    onRemoveAction: () => void;
    updateBlockDataAction: (updater: (data: any) => any) => void;
}) {
    switch (block.type) {
        case 'heading':
            return (
                <HeadingBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        case 'paragraph':
            return (
                <ParagraphBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        case 'image':
            return (
                <ImageBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        case 'carousel':
            return (
                <CarouselBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        case 'grid':
            return (
                <GridBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        case 'before-after':
            return (
                <BeforeAfterBlock
                    block={block}
                    onRemoveAction={onRemoveAction}
                    updateBlockDataAction={updateBlockDataAction}
                />
            );
        default:
            return null;
    }
}
