'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Block, BlockType } from '@/lib/constants/blockTypes';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';

export type UploadActions = {
    publishShot: () => void;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    blocks: Block[];
    blockCount: number;
    addBlock: (type: BlockType) => void;
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
    thumbnailSrc: string | null;
    setThumbnail: (src: string, bytes: number) => void;
    totalBytes: number;
    tryReplaceBytes: (oldBytes: number, newBytes: number) => boolean;
    releaseBytes: (bytes: number) => void;
    filesMap: Map<string, File[]>;
    addFileToBlock: (blockId: string, file: File) => void;
    removeFilesForBlock: (blockId: string) => void;
};

const UploadActionsContext = createContext<UploadActions | null>(null);

export function useUploadActions() {
    const ctx = useContext(UploadActionsContext);
    if (!ctx) throw new Error('useUploadActions must be used within provider');
    return ctx;
}

export const MAX_BLOCKS = 10;

export function UploadActionsProvider({ children }: { children: React.ReactNode }) {
    // Monotonic client-side counter for generating stable IDs without randomness or time
    const nextIdRef = useRef(0);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
    const [thumbnailBytes, setThumbnailBytes] = useState<number>(0);
    const [totalBytes, setTotalBytes] = useState<number>(0);
    const [filesMap, setFilesMap] = useState<Map<string, File[]>>(new Map());

    const blockCount = blocks.length;

    const addBlock = useCallback((type: BlockType) => {
        setBlocks((prevBlocks) => {
            if (prevBlocks.length >= MAX_BLOCKS) {
                alert(`Maximum ${MAX_BLOCKS} blocks allowed`);
                return prevBlocks;
            }
            const id = `block-${nextIdRef.current++}`;
            return [...prevBlocks, { id, type, data: {} }];
        });
    }, []);

    const tryReplaceBytes = useCallback(
        (oldBytes: number, newBytes: number) => {
            const current = totalBytes - (oldBytes || 0);
            if (current + newBytes > ShotUploadPolicy.MAX_TOTAL_BYTES) {
                alert(`Total upload size exceeds ${ShotUploadPolicy.MAX_TOTAL_BYTES_MB} MB.`);
                return false;
            }
            setTotalBytes(current + newBytes);
            return true;
        },
        [totalBytes, setTotalBytes]
    );

    const releaseBytes = useCallback(
        (bytes: number) => {
            if (!bytes) return;
            setTotalBytes((prev) => Math.max(0, prev - bytes));
        },
        [setTotalBytes]
    );

    const setThumbnail = useCallback(
        (src: string, bytes: number) => {
            // Calculate what total would be if we replaced existing thumbnail bytes with new bytes
            const currentExcludingThumb = totalBytes - (thumbnailBytes || 0);
            if (currentExcludingThumb + bytes > ShotUploadPolicy.MAX_TOTAL_BYTES) {
                alert(`Total upload size exceeds ${ShotUploadPolicy.MAX_TOTAL_BYTES_MB} MB.`);
                return;
            }
            setThumbnailSrc(src);
            setThumbnailBytes(bytes);
            setTotalBytes(currentExcludingThumb + bytes);
        },
        [totalBytes, thumbnailBytes]
    );

    const validate = useCallback(() => {
        if (!thumbnailSrc) {
            alert('Please upload a thumbnail image');
            return false;
        }
        if (!title.trim()) {
            alert('Please enter a title');
            return false;
        }
        if (!category) {
            alert('Please select a category');
            return false;
        }
        return true;
    }, [title, category, thumbnailSrc]);

    const publishShot = useCallback(async () => {
        if (!validate()) return;

        try {
            // Prepare files and mapping in a stable order
            const files: File[] = [];
            const mapping: { blockId: string; kind: 'image'; caption?: string }[] = [];

            // Extract single thumbnail file (required)
            const thumbFiles = filesMap.get('__thumbnail__') || [];
            const thumbnailFile = thumbFiles[0];

            // Walk blocks in visible order
            for (const b of blocks) {
                // Collect any originals queued for this block
                const arr = filesMap.get(b.id) || [];
                if (!arr.length) continue;
                for (const f of arr) {
                    files.push(f);
                    const caption = (b as any)?.data?.caption as string | undefined;
                    mapping.push({ blockId: b.id, kind: 'image', caption });
                }
            }

            if (files.length === 0) {
                alert('Please add at least one image before publishing.');
                return;
            }

            // Create client-side shot id if you don't already have one
            const shotId = crypto.randomUUID();

            const form = new FormData();
            for (const f of files) form.append('files', f, f.name);
            if (thumbnailFile) form.append('thumbnail', thumbnailFile, thumbnailFile.name);
            form.append(
                'meta',
                JSON.stringify({
                    // userId will be derived server-side from the authenticated session
                    shotId,
                    files: mapping,
                    title,
                    description,
                    category,
                    blocks: blocks.map((b, idx) => ({
                        id: b.id,
                        type: b.type,
                        position: idx, // stable order as shown in the editor
                        content: (b as any)?.data?.text ?? undefined,
                        align: (b as any)?.data?.align ?? undefined,
                        title: (b as any)?.data?.title ?? undefined,
                        subtitle: (b as any)?.data?.subtitle ?? undefined,
                    })),
                })
            );

            const res = await fetch('/api/shots/publish', { method: 'POST', body: form });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to publish');
            }

            console.log('Publish results', data);
            alert('Shot images uploaded successfully.');
            // TODO: create the shot record and redirect to shot page if desired
        } catch (e: any) {
            console.error(e);
            alert(e?.message || 'Failed to publish');
        }
    }, [validate, title, category, description, blocks, thumbnailSrc, filesMap]);

    const addFileToBlock = useCallback((blockId: string, file: File) => {
        setFilesMap((prev) => {
            const next = new Map(prev);
            const arr = next.get(blockId) ?? [];
            next.set(blockId, [...arr, file]);
            return next;
        });
    }, []);

    const removeFilesForBlock = useCallback((blockId: string) => {
        setFilesMap((prev) => {
            const next = new Map(prev);
            next.delete(blockId);
            return next;
        });
    }, []);

    const value = useMemo(
        () => ({
            publishShot,
            title,
            setTitle,
            description,
            setDescription,
            category,
            setCategory,
            blocks,
            blockCount,
            setBlocks,
            addBlock,
            thumbnailSrc,
            setThumbnail,
            totalBytes,
            tryReplaceBytes,
            releaseBytes,
            filesMap,
            addFileToBlock,
            removeFilesForBlock,
        }),
        [
            publishShot,
            title,
            setTitle,
            description,
            setDescription,
            category,
            setCategory,
            blocks,
            blockCount,
            setBlocks,
            addBlock,
            thumbnailSrc,
            setThumbnail,
            totalBytes,
            tryReplaceBytes,
            releaseBytes,
            filesMap,
            addFileToBlock,
            removeFilesForBlock,
        ]
    );

    return <UploadActionsContext.Provider value={value}>{children}</UploadActionsContext.Provider>;
}
