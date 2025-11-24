import { fileTypeFromBuffer } from 'file-type';
import { imageSize } from 'image-size';
import { AppError } from '@/lib/http/responses';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';

export async function sniffImage(buf: Buffer) {
    const ft = await fileTypeFromBuffer(buf);
    if (!ft || !ShotUploadPolicy.ALLOWED_IMAGE_MIME_TYPES.includes(ft.mime as any)) {
        throw new AppError(415, 'unsupported_type', 'Unsupported or untrusted file type');
    }

    const dim = imageSize(buf);
    if (!dim.width || !dim.height || !dim.type) {
        throw new AppError(415, 'bad_metadata', 'Could not parse image metadata.');
    }

    return { ft, dim } as const;
}

export function enforceImagePolicy(dim: { width: number; height: number; type: string }) {
    if (dim.width > ShotUploadPolicy.MAX_WIDTH || dim.height > ShotUploadPolicy.MAX_HEIGHT) {
        throw new AppError(413, 'dimension_too_large', 'Image dimensions too large');
    }

    const pixels = dim.width * dim.height;
    if (pixels > ShotUploadPolicy.MAX_MEGAPIXELS * 1_000_000) {
        throw new AppError(413, 'too_many_pixels', 'Image pixel count too large');
    }

    const estimated = ShotUploadPolicy.estimatedUncompressedBytes(dim.width, dim.height);
    if (estimated > ShotUploadPolicy.MAX_UNCOMPRESSED_BYTES) {
        throw new AppError(
            413,
            'decoded_too_large',
            'Uncompressed image would exceed memory budget'
        );
    }
}
