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

    // --- Derived, self-documenting decode-safety limits (no magic numbers) ---
    // Basis: pick a decoded-memory budget B (in MB) for a single image. We assume worst-case RGBA8 (4 bytes/pixel)
    // Formulas:
    //   MAX_UNCOMPRESSED_BYTES = B * 1024 * 1024
    //   MAX_PIXELS            = floor(MAX_UNCOMPRESSED_BYTES / 4)
    //   MAX_MEGAPIXELS        = floor(MAX_PIXELS / 1_000_000)
    // Single-dimension caps protect GPU/decoder even before area/bytes checks.

    const DECODE_MEMORY_BUDGET_MB = 256; // B — tune centrally
    const BYTES_PER_PIXEL = 4; // RGBA8 worst case

    const MAX_UNCOMPRESSED_BYTES = DECODE_MEMORY_BUDGET_MB * 1024 * 1024; // e.g., 268,435,456
    const MAX_PIXELS = Math.floor(MAX_UNCOMPRESSED_BYTES / BYTES_PER_PIXEL); // ~67,108,864
    const MAX_MEGAPIXELS = Math.floor(MAX_PIXELS / 1_000_000); // ~67

    // Conservative per-side caps to avoid pathological aspect ratios and match common GPU limits.
    const MAX_WIDTH = 12000;
    const MAX_HEIGHT = 12000;

    // Optional compressed→decoded expansion ratio guard. Images usually compress 4–20×; 64× is conservative.
    const MAX_EXPANSION_RATIO = 64;

    // Animated images policies (not currently used by server route, but exported for future use)
    const ALLOW_ANIMATED = false;
    const MAX_FRAMES = 200;
    const MAX_TOTAL_PIXELS_ACROSS_FRAMES = MAX_PIXELS * 5; // decoders often reuse buffers; use a small multiple

    function estimatedUncompressedBytes(width: number, height: number): number {
        // Conservative bound using RGBA8; clamp to Number.MAX_SAFE_INTEGER to guard against overflow
        const pixels = Math.max(0, Math.floor(width) * Math.floor(height));
        const est = pixels * BYTES_PER_PIXEL;
        return est > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : est;
    }

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
        // Decode-safety derived limits (see formulas above)
        DECODE_MEMORY_BUDGET_MB,
        BYTES_PER_PIXEL,
        MAX_UNCOMPRESSED_BYTES,
        MAX_PIXELS,
        MAX_MEGAPIXELS,
        MAX_WIDTH,
        MAX_HEIGHT,
        MAX_EXPANSION_RATIO,
        ALLOW_ANIMATED,
        MAX_FRAMES,
        MAX_TOTAL_PIXELS_ACROSS_FRAMES,
        // Helpers (scoped to this policy)
        estimatedUncompressedBytes,
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
