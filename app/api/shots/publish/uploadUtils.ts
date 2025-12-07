import { AppError } from '@/lib/http/responses';

export type InputFile = { file: File; ab: ArrayBuffer; size: number };

export async function collectInputsFromForm(form: FormData): Promise<InputFile[]> {
    const files = form.getAll('files');
    const arr: InputFile[] = [];
    for (const entry of files) {
        if (entry instanceof File) {
            const ab = await entry.arrayBuffer();
            arr.push({ file: entry, ab, size: entry.size });
        }
    }
    return arr;
}

export async function collectThumbnail(form: FormData): Promise<InputFile | null> {
    const entry = form.get('thumbnail');
    if (entry instanceof File) {
        const ab = await entry.arrayBuffer();
        return { file: entry, ab, size: entry.size };
    }
    return null;
}

export function enforceUploadSizeLimits(
    inputs: Array<{ size: number }>,
    policy: { MAX_TOTAL_BYTES: number; MAX_IMAGE_BYTES: number }
) {
    const total = inputs.reduce((s, it) => s + it.size, 0);
    if (total > policy.MAX_TOTAL_BYTES) {
        throw new AppError(413, 'total_too_large', 'Total upload size exceeds limit.');
    }
    for (const it of inputs) {
        if (it.size > policy.MAX_IMAGE_BYTES) {
            throw new AppError(413, 'file_too_large', 'A file exceeds the per-file size limit.');
        }
    }
}
