export const ALLOWED_IMAGE_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
] as const;

export const ACCEPT_IMAGE_TYPES = ALLOWED_IMAGE_MIME_TYPES.join(',');

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB total
export const MAX_TOTAL_BYTES_MB = (MAX_TOTAL_BYTES / (1024 * 1024)).toFixed(0); // 100 MB total

export type FileValidationError = { type: 'type' | 'size'; message: string };
