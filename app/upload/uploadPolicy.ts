// Single source of truth for supported image formats and their MIME types/extensions
const IMAGE_FORMATS = {
    jpeg: {
        mimes: ['image/jpeg', 'image/jpg'],
        exts: ['jpg', 'jpeg'],
        defaultExt: 'jpg',
    },
    png: {
        mimes: ['image/png'],
        exts: ['png'],
        defaultExt: 'png',
    },
    webp: {
        mimes: ['image/webp'],
        exts: ['webp'],
        defaultExt: 'webp',
    },
    gif: {
        mimes: ['image/gif'],
        exts: ['gif'],
        defaultExt: 'gif',
    },
    avif: {
        mimes: ['image/avif'],
        exts: ['avif'],
        defaultExt: 'avif',
    },
    tiff: {
        mimes: ['image/tiff'],
        exts: ['tif', 'tiff'],
        defaultExt: 'tif',
    },
    bmp: {
        mimes: ['image/bmp'],
        exts: ['bmp'],
        defaultExt: 'bmp',
    },
    svg: {
        mimes: ['image/svg+xml'],
        exts: ['svg'],
        defaultExt: 'svg',
    },
    ico: {
        mimes: ['image/x-icon'],
        exts: ['ico'],
        defaultExt: 'ico',
    },
} as const;

export type OriginalImageFormat = keyof typeof IMAGE_FORMATS;

// Derived allow-list of MIME types and the <input accept> string
export const ALLOWED_IMAGE_MIME_TYPES: readonly string[] = Array.from(
    new Set(Object.values(IMAGE_FORMATS).flatMap((f) => f.mimes))
);

export const ACCEPT_IMAGE_TYPES = ALLOWED_IMAGE_MIME_TYPES.join(',');

// Size limits
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_IMAGE_BYTES_MB = (MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0);
export const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB total
export const MAX_TOTAL_BYTES_MB = (MAX_TOTAL_BYTES / (1024 * 1024)).toFixed(0);

// Map MIME type to file extension using the registry
const MIME_TO_EXT: ReadonlyMap<string, string> = new Map(
    Object.values(IMAGE_FORMATS).flatMap((f) => f.mimes.map((m) => [m, f.defaultExt] as const))
);

// Map known extensions back to our canonical OriginalImageFormat key
const EXT_TO_FORMAT: ReadonlyMap<string, OriginalImageFormat> = new Map(
    Object.entries(IMAGE_FORMATS).flatMap(([format, def]) =>
        def.exts.map((ext) => [ext, format as OriginalImageFormat] as const)
    )
);

export function extFromMime(mime: string): string {
    const key = (mime || '').toLowerCase();
    return MIME_TO_EXT.get(key) ?? IMAGE_FORMATS.jpeg.defaultExt;
}

// Normalize a probed type or file extension (e.g., 'jpg' -> 'jpeg', 'tif' -> 'tiff')
export function normalizeImageType(typeOrExt: string | undefined | null): OriginalImageFormat | null {
    if (!typeOrExt) return null;
    const t = String(typeOrExt).toLowerCase();
    // If it's already a known format key
    if ((IMAGE_FORMATS as any)[t]) return t as OriginalImageFormat;
    // If it's a known extension, map to canonical format
    const byExt = EXT_TO_FORMAT.get(t as any);
    return byExt ?? null;
}
