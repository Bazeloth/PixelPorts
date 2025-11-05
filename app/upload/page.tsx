'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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

// Types
type BlockType = 'heading' | 'paragraph' | 'image' | 'carousel' | 'grid' | 'before-after';

type Block = {
    id: string;
    type: BlockType;
    data: any;
};

function UploadShotPage() {
    const uploadActions = useUploadActions();
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

    const triggerThumbnailUpload = () => {
        thumbnailInputRef.current?.click();
    };

    const handleThumbnailUpload = useCallback((file?: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadActions.setThumbnailSrc(String(e.target?.result || ''));
        };
        reader.readAsDataURL(file);
    }, []);

    const removeBlock = useCallback((id: string) => {
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
            <main className="flex h-[calc(100vh-4rem)]">
                {/* Left - Live preview */}
                <div className="flex-1 overflow-y-auto bg-white border-r border-gray-200 p-8">
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
                            <div
                                className="editable-block cursor-pointer"
                                onClick={triggerThumbnailUpload}
                            >
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
                                    accept="image/*"
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

                                {uploadActions.blocks.map((block) => (
                                    <PreviewBlock
                                        key={block.id}
                                        block={block}
                                        onRemove={() => removeBlock(block.id)}
                                        updateBlockData={(u) => updateBlockData(block.id, u)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Controls */}
                <div className="w-96 overflow-y-auto bg-gray-50 p-6">
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
                                            className="text-gray-400 hover:text-red-600"
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
            </main>
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
    // todo: incorperate this into the type itself as an attribute?
    return (
        {
            heading: 'Heading',
            paragraph: 'Paragraph',
            image: 'Image',
            carousel: 'Carousel',
            grid: 'Grid gallery',
            'before-after': 'Before/After',
        } as const
    )[t];
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
    onRemove,
    updateBlockData,
}: {
    block: Block;
    onRemove: () => void;
    updateBlockData: (updater: (data: any) => any) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image common handler
    const handleImageFile = (file: File, cb: (src: string) => void) => {
        const reader = new FileReader();
        reader.onload = (e) => cb(String(e.target?.result || ''));
        reader.readAsDataURL(file);
    };

    // Before/After slider
    const sliderRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeImgRef = useRef<HTMLImageElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !containerRef.current || !sliderRef.current || !beforeImgRef.current)
                return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
            sliderRef.current.style.left = `${pct}%`;
            beforeImgRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        },
        [isDragging]
    );

    useEffect(() => {
        const onUp = () => setIsDragging(false);
        const onMove = (e: MouseEvent) => onMouseMove(e);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('mousemove', onMove);
        return () => {
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('mousemove', onMove);
        };
    }, [onMouseMove]);

    // Render types
    if (block.type === 'heading') {
        return (
            <div className="editable-block">
                <div className="block-toolbar mb-2">
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Click to add heading..."
                    value={block.data.text || ''}
                    onChange={(e) => updateBlockData((d) => ({ ...d, text: e.target.value }))}
                    className="w-full text-2xl font-semibold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
                />
            </div>
        );
    }

    if (block.type === 'paragraph') {
        return (
            <div className="editable-block">
                <div className="block-toolbar mb-2">
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                <textarea
                    rows={4}
                    placeholder="Click to add paragraph..."
                    value={block.data.text || ''}
                    onChange={(e) => updateBlockData((d) => ({ ...d, text: e.target.value }))}
                    className="w-full text-gray-700 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
                />
            </div>
        );
    }

    if (block.type === 'image') {
        const onFile = (f?: File | null) =>
            f && handleImageFile(f, (src) => updateBlockData((d) => ({ ...d, image: src })));

        return (
            <div
                className="editable-block cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="block-toolbar flex gap-2 mb-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                        Change
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                {!block.data.image ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50">
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
                                updateBlockData((d) => ({ ...d, caption: e.target.value }))
                            }
                            className="w-full mt-3 text-sm text-gray-600 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent text-center"
                        />
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFile(e.target.files?.[0])}
                />
            </div>
        );
    }

    if (block.type === 'carousel') {
        const mainInputRef = useRef<HTMLInputElement>(null);

        const setMainImage = (src: string) => updateBlockData((d) => ({ ...d, mainImage: src }));
        const addThumbAt = (index: number, src: string) =>
            updateBlockData((d) => {
                const thumbnails: string[] = [...(d.thumbnails || [])];
                thumbnails[index] = src;
                return { ...d, thumbnails };
            });

        const onMainFile = (f?: File | null) => f && handleImageFile(f, setMainImage);
        const onThumbFile = (index: number, f?: File | null) =>
            f && handleImageFile(f, (src) => addThumbAt(index, src));

        const thumbs: string[] = block.data?.thumbnails || [];

        return (
            <div className="editable-block">
                <div className="block-toolbar mb-2">
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Main image */}
                    <div className="relative">
                        <div
                            id={`carousel-main-${block.id}`}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50 cursor-pointer"
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
                                    <p className="text-gray-600">Click to upload main image</p>
                                </>
                            )}
                        </div>
                        <input
                            ref={mainInputRef}
                            type="file"
                            accept="image/*"
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
                            <CarouselThumbPicker
                                onPick={(file) => onThumbFile(thumbs.length, file)}
                            />
                        )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Add up to 10 thumbnail images
                    </p>
                </div>
            </div>
        );
    }

    if (block.type === 'grid') {
        const setGridAt = (index: number, src: string) =>
            updateBlockData((d) => {
                const images: string[] = [...(d.images || [])];
                images[index] = src;
                return { ...d, images };
            });

        const onGridFile = (index: number, f?: File | null) =>
            f && handleImageFile(f, (src) => setGridAt(index, src));
        const images: string[] = block.data?.images || [];

        return (
            <div className="editable-block">
                <div className="block-toolbar mb-2">
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 aspect-square flex items-center justify-center cursor-pointer hover:border-purple-600 overflow-hidden"
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
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => onGridFile(i, e.target.files?.[0])}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (block.type === 'before-after') {
        const beforeInputRef = useRef<HTMLInputElement>(null);
        const afterInputRef = useRef<HTMLInputElement>(null);

        const setBefore = (src: string) => updateBlockData((d) => ({ ...d, beforeImage: src }));
        const setAfter = (src: string) => updateBlockData((d) => ({ ...d, afterImage: src }));

        const onBeforeFile = (f?: File | null) => f && handleImageFile(f, setBefore);
        const onAfterFile = (f?: File | null) => f && handleImageFile(f, setAfter);

        const before = block.data?.beforeImage;
        const after = block.data?.afterImage;
        const showSlider = Boolean(before && after);

        return (
            <div className="editable-block">
                <div className="block-toolbar mb-2">
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Before
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 aspect-square flex items-center justify-center cursor-pointer hover:border-purple-600"
                                onClick={() => beforeInputRef.current?.click()}
                            >
                                {before ? (
                                    <img
                                        src={before}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt="Before"
                                    />
                                ) : (
                                    <div>
                                        <Icon
                                            icon={Plus}
                                            size={20}
                                            className="w-8 h-8 text-gray-400 mx-auto mb-1"
                                            ariaLabel="Upload before"
                                        />
                                        <p className="text-xs text-gray-500">Upload before</p>
                                    </div>
                                )}
                                <input
                                    ref={beforeInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => onBeforeFile(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                After
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 aspect-square flex items-center justify-center cursor-pointer hover:border-purple-600"
                                onClick={() => afterInputRef.current?.click()}
                            >
                                {after ? (
                                    <img
                                        src={after}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt="After"
                                    />
                                ) : (
                                    <div>
                                        <Icon
                                            icon={Plus}
                                            size={20}
                                            className="w-8 h-8 text-gray-400 mx-auto mb-1"
                                            ariaLabel="Upload after"
                                        />
                                        <p className="text-xs text-gray-500">Upload after</p>
                                    </div>
                                )}
                                <input
                                    ref={afterInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => onAfterFile(e.target.files?.[0])}
                                />
                            </div>
                        </div>
                    </div>

                    {showSlider && (
                        <div
                            ref={containerRef}
                            className="relative rounded-lg overflow-hidden aspect-[16/9] bg-black/5"
                        >
                            <img
                                src={after || ''}
                                alt="After"
                                className="w-full h-full object-cover"
                            />
                            <img
                                ref={beforeImgRef}
                                src={before || ''}
                                alt="Before"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                style={{ clipPath: 'inset(0 50% 0 0)' }}
                            />
                            <div
                                ref={sliderRef}
                                className="absolute top-0 left-1/2 w-1 h-full bg-white cursor-ew-resize z-10 shadow"
                                onMouseDown={() => setIsDragging(true)}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Fallback (should not happen)
    return null;
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
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
            />
        </div>
    );
}
