'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { BlockType } from '@/lib/constants/blockTypes';
import { MAX_TOTAL_BYTES } from '@/app/upload/uploadPolicy';

export type UploadActions = {
    saveDraft: () => void;
    publishShot: () => void;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    blocks: any[];
    blockCount: number;
    addBlock: (type: BlockType) => void;
    setBlocks: React.Dispatch<React.SetStateAction<any[]>>;
    thumbnailSrc: string | null;
    setThumbnailSrc: React.Dispatch<React.SetStateAction<string | null>>;
    // Upload size tracking
    totalBytes: number;
    tryAddBytes: (bytes: number) => boolean;
    tryReplaceBytes: (oldBytes: number, newBytes: number) => boolean;
    releaseBytes: (bytes: number) => void;
    thumbnailBytes: number;
    setThumbnailBytes: React.Dispatch<React.SetStateAction<number>>;
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
    const [blocks, setBlocks] = useState<any[]>([]);
    const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
    const [thumbnailBytes, setThumbnailBytes] = useState<number>(0);
    const [totalBytes, setTotalBytes] = useState<number>(0);

    const blockCount = blocks.length;

    const addBlock = useCallback((type: BlockType) => {
        setBlocks((prevBlocks) => {
            if (prevBlocks.length >= MAX_BLOCKS) {
                alert('Maximum 10 blocks allowed');
                return prevBlocks;
            }
            const id = `block-${nextIdRef.current++}`;
            return [...prevBlocks, { id, type, data: {} }];
        });
    }, []);

    const tryAddBytes = useCallback((bytes: number) => {
        if (totalBytes + bytes > MAX_TOTAL_BYTES) {
            alert('Total upload size exceeds 100 MB.');
            return false;
        }
        setTotalBytes((v) => v + bytes);
        return true;
    }, [totalBytes]);

    const tryReplaceBytes = useCallback((oldBytes: number, newBytes: number) => {
        const current = totalBytes - (oldBytes || 0);
        if (current + newBytes > MAX_TOTAL_BYTES) {
            alert('Total upload size exceeds 100 MB.');
            return false;
        }
        setTotalBytes(current + newBytes);
        return true;
    }, [totalBytes]);

    const releaseBytes = useCallback((bytes: number) => {
        if (!bytes) return;
        setTotalBytes((v) => Math.max(0, v - bytes));
    }, []);

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

    const saveDraft = useCallback(() => {
        if (!validate()) return;
        // save logic
        alert('Draft saved!');
    }, [validate, title, category, description, blocks, thumbnailSrc]);

    const publishShot = useCallback(() => {
        if (!validate()) return;
        // publish logic
        alert('Shot published!');
    }, [validate, title, category, description, blocks, thumbnailSrc]);

    const value = useMemo(
        () => ({
            saveDraft,
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
            setThumbnailSrc,
            totalBytes,
            tryAddBytes,
            tryReplaceBytes,
            releaseBytes,
            thumbnailBytes,
            setThumbnailBytes,
        }),
        [
            saveDraft,
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
            setThumbnailSrc,
            totalBytes,
            tryAddBytes,
            tryReplaceBytes,
            releaseBytes,
            thumbnailBytes,
            setThumbnailBytes,
        ]
    );

    return <UploadActionsContext.Provider value={value}>{children}</UploadActionsContext.Provider>;
}
