// uploadPolicy.ts
// Centralized, clearly separated upload policies for Shots and Avatars
// Each policy is self-contained: formats, accept strings, size limits, and helpers

type FormatDef = {
    mimes: readonly string[];
    exts: readonly string[];
    defaultExt: string;
};

type FormatsMap = Record<string, FormatDef>;

function createImagePolicy<const F extends FormatsMap>(
    formats: F,
    options: {
        maxBytes: number;
        // Optional total cap; if omitted, equals maxBytes by default (single-file use cases like avatar)
        totalBytes?: number;
    }
) {
    type FormatKey = keyof F & string;

    const ALLOWED_IMAGE_MIME_TYPES: readonly string[] = Array.from(
        new Set(Object.values(formats).flatMap((f) => f.mimes))
    );

    const ACCEPT_IMAGE_TYPES = ALLOWED_IMAGE_MIME_TYPES.join(',');

    const MAX_IMAGE_BYTES = options.maxBytes;
    const MAX_IMAGE_BYTES_MB = (MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0);

    const MAX_TOTAL_BYTES = options.totalBytes ?? options.maxBytes;
    const MAX_TOTAL_BYTES_MB = (MAX_TOTAL_BYTES / (1024 * 1024)).toFixed(0);

    // MIME -> default extension map
    const MIME_TO_EXT: ReadonlyMap<string, string> = new Map(
        Object.values(formats).flatMap((f) => f.mimes.map((m) => [m, f.defaultExt] as const))
    );

    // ext -> canonical format key map
    const EXT_TO_FORMAT: ReadonlyMap<string, FormatKey> = new Map(
        Object.entries(formats).flatMap(([format, def]) =>
            def.exts.map((ext) => [ext, format as FormatKey] as const)
        )
    );

    function extFromMime(mime: string): string {
        const key = (mime || '').toLowerCase();
        // Fall back to the first defined format's default ext
        const firstDefault = Object.values(formats)[0]?.defaultExt ?? 'jpg';
        return MIME_TO_EXT.get(key) ?? firstDefault;
    }

    function normalizeImageType(typeOrExt: string | undefined | null): FormatKey | null {
        if (!typeOrExt) return null;
        const t = String(typeOrExt).toLowerCase();
        // Direct key hit
        if ((formats as any)[t]) return t as FormatKey;
        // Extension hit
        const byExt = EXT_TO_FORMAT.get(t as any);
        return byExt ?? null;
    }

    return {
        // Types
        // FormatKey is the canonical union of allowed format names for this policy
        // e.g., 'jpeg' | 'png' | 'webp'
        // Values
        FORMATS: formats,
        ALLOWED_IMAGE_MIME_TYPES,
        ACCEPT_IMAGE_TYPES,
        MAX_IMAGE_BYTES,
        MAX_IMAGE_BYTES_MB,
        MAX_TOTAL_BYTES,
        MAX_TOTAL_BYTES_MB,
        // Helpers (scoped to this policy)
        extFromMime,
        normalizeImageType,
    } as const;
}

// ---------------------------
// Shot settings (existing behavior)
// ---------------------------
const SHOT_FORMATS = {
    jpeg: {
        mimes: ['image/jpeg', 'image/jpg'] as const,
        exts: ['jpg', 'jpeg'] as const,
        defaultExt: 'jpg',
    },
    png: {
        mimes: ['image/png'] as const,
        exts: ['png'] as const,
        defaultExt: 'png',
    },
    tiff: {
        mimes: ['image/tiff'] as const,
        exts: ['tif', 'tiff'] as const,
        defaultExt: 'tif',
    },
    bmp: {
        mimes: ['image/bmp'] as const,
        exts: ['bmp'] as const,
        defaultExt: 'bmp',
    },
    webp: {
        mimes: ['image/webp'] as const,
        exts: ['webp'] as const,
        defaultExt: 'webp',
    },
} as const;

export const ShotUploadPolicy = createImagePolicy(SHOT_FORMATS, {
    maxBytes: 10 * 1024 * 1024, // 10 MB per file
    totalBytes: 100 * 1024 * 1024, // 100 MB total
});

export type ShotOriginalImageFormat = keyof typeof SHOT_FORMATS;

// ---------------------------
// Avatar settings (JPG/PNG/WebP), 5MB max
// ---------------------------
const AVATAR_FORMATS = {
    jpeg: {
        mimes: ['image/jpeg', 'image/jpg'] as const,
        exts: ['jpg', 'jpeg'] as const,
        defaultExt: 'jpg',
    },
    png: {
        mimes: ['image/png'] as const,
        exts: ['png'] as const,
        defaultExt: 'png',
    },
    webp: {
        mimes: ['image/webp'] as const,
        exts: ['webp'] as const,
        defaultExt: 'webp',
    },
} as const;

export const AvatarUploadPolicy = createImagePolicy(AVATAR_FORMATS, {
    maxBytes: 5 * 1024 * 1024, // 5 MB per file
    // No multi-file total cap for avatar; default equals maxBytes
});

export type AvatarOriginalImageFormat = keyof typeof AVATAR_FORMATS;
