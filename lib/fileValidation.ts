// Client-side image file validation with magic-number checks and size limits
// Reuses existing upload policy constants to keep things DRY

import {
    ALLOWED_IMAGE_MIME_TYPES,
    MAX_IMAGE_BYTES as MAX_FILE_SIZE_BYTES,
    MAX_TOTAL_BYTES as MAX_TOTAL_SIZE_BYTES,
    MAX_IMAGE_BYTES_MB,
    MAX_TOTAL_BYTES_MB,
} from '@/app/upload/uploadPolicy';

export type ValidationError = {
    code:
        | 'file-too-large'
        | 'total-too-large'
        | 'unsupported-type'
        | 'signature-mismatch'
        | 'end-marker-missing';
    message: string;
};

// Utility: read first/last N bytes of a File
export async function readHead(file: File, n = 128): Promise<Uint8Array> {
    const blob = file.slice(0, n);
    const ab = await blob.arrayBuffer();
    return new Uint8Array(ab);
}

export async function readTail(file: File, n = 128): Promise<Uint8Array> {
    const start = Math.max(0, file.size - n);
    const blob = file.slice(start, file.size);
    const ab = await blob.arrayBuffer();
    return new Uint8Array(ab);
}

function u8eq(a: Uint8Array, start: number, sig: number[]): boolean {
    if (start + sig.length > a.length) return false;
    for (let i = 0; i < sig.length; i++) if (a[start + i] !== sig[i]) return false;
    return true;
}

function ascii(str: string): number[] {
    return Array.from(str).map((c) => c.charCodeAt(0));
}

// --- Signature validators ---

// JPEG: SOI 0xFF 0xD8 0xFF, EOI 0xFF 0xD9
export function validateJpegSignature(bytes: Uint8Array): boolean {
    return u8eq(bytes, 0, [0xff, 0xd8, 0xff]);
}

export function validateJpegEndMarker(tail: Uint8Array): boolean {
    const len = tail.length;
    if (len < 2) return false;
    return tail[len - 2] === 0xff && tail[len - 1] === 0xd9;
}

// PNG: 89 50 4E 47 0D 0A 1A 0A
export function validatePngSignature(bytes: Uint8Array): boolean {
    return u8eq(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

// WebP (RIFF): "RIFF" + 4 bytes size + "WEBP"
export function validateWebpSignature(bytes: Uint8Array): boolean {
    const b = bytes;
    if (b.length < 12) return false;
    if (!u8eq(b, 0, ascii('RIFF'))) return false;
    if (!u8eq(b, 8, ascii('WEBP'))) return false;
    return true;
}

// GIF: GIF87a or GIF89a
export function validateGifSignature(bytes: Uint8Array): boolean {
    const b = bytes;
    return u8eq(b, 0, ascii('GIF87a')) || u8eq(b, 0, ascii('GIF89a'));
}

// AVIF: ISOBMFF ftyp box with brand 'avif'
export function validateAvifSignature(bytes: Uint8Array): boolean {
    const b = bytes;
    if (b.length < 16) return false;
    if (!u8eq(b, 4, ascii('ftyp'))) return false;
    if (u8eq(b, 8, ascii('avif'))) return true;
    for (let i = 16; i + 3 < Math.min(b.length, 64); i += 4) {
        if (u8eq(b, i, ascii('avif'))) return true;
    }
    return false;
}

// TIFF: little-endian 49 49 2A 00 or big-endian 4D 4D 00 2A
export function validateTiffSignature(bytes: Uint8Array): boolean {
    return u8eq(bytes, 0, [0x49, 0x49, 0x2a, 0x00]) || u8eq(bytes, 0, [0x4d, 0x4d, 0x00, 0x2a]);
}

// BMP: 42 4D ("BM")
export function validateBmpSignature(bytes: Uint8Array): boolean {
    return u8eq(bytes, 0, [0x42, 0x4d]);
}

// SVG: textual; look for '<svg' within first chunk
export function validateSvgSignature(bytes: Uint8Array): boolean {
    const text = new TextDecoder('utf-8').decode(bytes);
    return /<svg[\s>]/i.test(text);
}

// ICO: 00 00 01 00
export function validateIcoSignature(bytes: Uint8Array): boolean {
    if (bytes.length < 4) return false;
    return u8eq(bytes, 0, [0x00, 0x00, 0x01, 0x00]);
}

export type SupportedType = {
    extension: string;
    mimeType: string;
    signatureValidator?: (head: Uint8Array) => boolean;
    endMarkerValidator?: (tail: Uint8Array) => boolean;
};

// Build supported types from allowed MIME types to keep things in sync
// We enumerate common extensions per MIME for validation.
export const SUPPORTED_FILE_TYPES: SupportedType[] = [
    {
        extension: 'jpg',
        mimeType: 'image/jpeg',
        signatureValidator: (b: Uint8Array) => validateJpegSignature(b),
        endMarkerValidator: validateJpegEndMarker,
    },
    {
        extension: 'jpeg',
        mimeType: 'image/jpeg',
        signatureValidator: (b: Uint8Array) => validateJpegSignature(b),
        endMarkerValidator: validateJpegEndMarker,
    },
    {
        extension: 'png',
        mimeType: 'image/png',
        signatureValidator: (b: Uint8Array) => validatePngSignature(b),
    },
    {
        extension: 'webp',
        mimeType: 'image/webp',
        signatureValidator: (b: Uint8Array) => validateWebpSignature(b),
    },
    {
        extension: 'gif',
        mimeType: 'image/gif',
        signatureValidator: (b: Uint8Array) => validateGifSignature(b),
    },
    {
        extension: 'avif',
        mimeType: 'image/avif',
        signatureValidator: (b: Uint8Array) => validateAvifSignature(b),
    },
    {
        extension: 'tif',
        mimeType: 'image/tiff',
        signatureValidator: (b: Uint8Array) => validateTiffSignature(b),
    },
    {
        extension: 'tiff',
        mimeType: 'image/tiff',
        signatureValidator: (b: Uint8Array) => validateTiffSignature(b),
    },
    {
        extension: 'bmp',
        mimeType: 'image/bmp',
        signatureValidator: (b: Uint8Array) => validateBmpSignature(b),
    },
    {
        extension: 'svg',
        mimeType: 'image/svg+xml',
        signatureValidator: (b: Uint8Array) => validateSvgSignature(b),
    },
    {
        extension: 'ico',
        mimeType: 'image/x-icon',
        signatureValidator: (b: Uint8Array) => validateIcoSignature(b),
    },
].filter((t) => ALLOWED_IMAGE_MIME_TYPES.includes(t.mimeType as any));

function getExtensionFromName(name: string): string {
    const idx = name.lastIndexOf('.');
    if (idx === -1) return '';
    return name.slice(idx + 1).toLowerCase();
}

export async function validateImageFileClient(
    file: File,
    currentTotalBytes: number
): Promise<ValidationError | null> {
    // Size checks first
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return { code: 'file-too-large', message: `File is larger than ${MAX_IMAGE_BYTES_MB}MB.` };
    }
    if (currentTotalBytes + file.size > MAX_TOTAL_SIZE_BYTES) {
        return {
            code: 'total-too-large',
            message: `Adding this file exceeds the ${MAX_TOTAL_BYTES_MB}MB total limit for a shot.`,
        };
    }

    // MIME + extension sanity
    const ext = getExtensionFromName(file.name);
    const byExt = SUPPORTED_FILE_TYPES.find((t) => t.extension === ext);
    const byMime = SUPPORTED_FILE_TYPES.find((t) => t.mimeType === (file.type || '').toLowerCase());
    const declared = byMime || byExt;
    if (!declared) {
        return {
            code: 'unsupported-type',
            message: 'Unsupported file type. Supported: ' + ALLOWED_IMAGE_MIME_TYPES.join(', '),
        };
    }

    // Read headers/tail
    const headBytes = await readHead(file, 128);
    const tailBytes = await readTail(file, 8);

    // Validate signature (magic number)
    if (declared.signatureValidator) {
        const ok = declared.signatureValidator(headBytes);
        if (!ok) {
            return {
                code: 'signature-mismatch',
                message: 'File header does not match its declared image type.',
            };
        }
    }

    // End marker checks where applicable
    if (declared.endMarkerValidator) {
        const okEnd = declared.endMarkerValidator(tailBytes);
        if (!okEnd) {
            return {
                code: 'end-marker-missing',
                message: 'File appears truncated or corrupted (end marker not found).',
            };
        }
    }

    // Cross-check: if both ext and mime present and disagree
    if (byExt && byMime && byExt.mimeType !== byMime.mimeType) {
        return {
            code: 'signature-mismatch',
            message: 'File extension and MIME type disagree.',
        };
    }

    return null;
}
