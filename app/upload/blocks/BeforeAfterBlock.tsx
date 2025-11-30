'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Icon from '@/app/Icon';
import { Plus } from 'lucide-react';
import { BlockComponentProps } from '@/lib/constants/blockTypes';
import { BlockToolbar } from '@/app/upload/BlockToolbar';
import { handleImageFile } from '@/app/upload/uploadUtils';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';
import { useUploadActions } from '@/app/upload/UploadActionsContext';
import EditableBlock from '@/app/upload/EditableBlock';
import { validateImageFileClient } from '@/lib/fileValidation';

export default function BeforeAfterBlock({
    block,
    onRemoveAction,
    updateBlockDataAction,
}: BlockComponentProps<'before-after'>) {
    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);
    const { tryReplaceBytes, totalBytes, addFileToBlock } = useUploadActions() as any;

    const setBefore = (src: string, size: number) =>
        updateBlockDataAction((d) => ({ ...d, beforeImage: src, beforeBytes: size }));
    const setAfter = (src: string, size: number) =>
        updateBlockDataAction((d) => ({ ...d, afterImage: src, afterBytes: size }));

    const onBeforeFile = async (f?: File | null) => {
        if (!f) return;
        const err = await validateImageFileClient(f, totalBytes);
        if (err) return alert(err.message);
        const prev = Number(block.data?.beforeBytes || 0);
        if (!tryReplaceBytes(prev, f.size)) return;

        // store original for publish
        addFileToBlock(block.id, f);

        handleImageFile(f, (src) => setBefore(src, f.size));
    };
    const onAfterFile = async (f?: File | null) => {
        if (!f) return;
        const err = await validateImageFileClient(f, totalBytes);
        if (err) return alert(err.message);
        const prev = Number(block.data?.afterBytes || 0);
        if (!tryReplaceBytes(prev, f.size)) return;

        // store original for publish
        addFileToBlock(block.id, f);

        handleImageFile(f, (src) => setAfter(src, f.size));
    };

    const before = block.data?.beforeImage;
    const after = block.data?.afterImage;
    const showSlider = Boolean(before && after);

    // Slider logic local to this block
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

    return (
        <EditableBlock>
            <BlockToolbar>
                <BlockToolbar.ToolbarRemoveButton onClickAction={onRemoveAction} />
            </BlockToolbar>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Before
                        </label>
                        <div
                            className={`border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 aspect-square flex items-center justify-center ${!before ? 'p-20 cursor-pointer hover:border-purple-600' : ''}`}
                            onClick={() => !before && beforeInputRef.current?.click()}
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
                                accept={ShotUploadPolicy.ACCEPT_IMAGE_TYPES}
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
                            className={`border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 aspect-square flex items-center justify-center ${!after ? 'p-20 cursor-pointer hover:border-purple-600' : ''}`}
                            onClick={() => !after && afterInputRef.current?.click()}
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
                                accept={ShotUploadPolicy.ACCEPT_IMAGE_TYPES}
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
                            className="w-full h-full object-cover select-none"
                        />
                        <img
                            ref={beforeImgRef}
                            src={before || ''}
                            alt="Before"
                            className="absolute top-0 left-0 w-full h-full object-cover select-none"
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
        </EditableBlock>
    );
}
