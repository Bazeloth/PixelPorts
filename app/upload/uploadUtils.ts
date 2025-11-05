"use client";

import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from './uploadPolicy';

export type FileValidationError = { type: 'type' | 'size'; message: string };

export function validateImageFile(file: File): FileValidationError | null {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as any)) {
        return {
            type: 'type',
            message: `Unsupported format. Allowed: PNG, JPG/JPEG, WebP, GIF`,
        };
    }
    if (file.size > MAX_IMAGE_BYTES) {
        const mb = (MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0);
        return { type: 'size', message: `File too large. Max ${mb} MB.` };
    }
    return null;
}

export function handleImageFile(file: File, cb: (src: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => cb(String((e.target as FileReader).result || ""));
    reader.readAsDataURL(file);
}
