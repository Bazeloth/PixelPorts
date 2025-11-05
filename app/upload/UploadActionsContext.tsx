'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BlockType } from '@/lib/constants/blockTypes';

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
};

const UploadActionsContext = createContext<UploadActions | null>(null);

export function useUploadActions() {
    const ctx = useContext(UploadActionsContext);
    if (!ctx) throw new Error('useUploadActions must be used within provider');
    return ctx;
}

export const MAX_BLOCKS = 10;

export function UploadActionsProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [blocks, setBlocks] = useState<any[]>([]);
    const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);

    const blockCount = blocks.length;

    const addBlock = useCallback((type: BlockType) => {
        setBlocks((prevBlocks) => {
            if (prevBlocks.length >= MAX_BLOCKS) {
                alert('Maximum 10 blocks allowed');
                return prevBlocks;
            }
            const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            return [...prevBlocks, { id, type, data: {} }];
        });
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
        ]
    );

    return <UploadActionsContext.Provider value={value}>{children}</UploadActionsContext.Provider>;
}
