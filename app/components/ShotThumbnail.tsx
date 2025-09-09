import Image from 'next/image';
import { getSupabase } from '@/lib/supabase';

export const ShotThumbnail = ({
    shotUploadId,
    fileExt,
    alt,
}: {
    shotUploadId: string;
    fileExt: string;
    alt: string;
}) => {
    const filePath = `${shotUploadId}.${fileExt}`;
    const src = getSupabase().storage.from('shots').getPublicUrl(filePath, {});

    return <Image src={src.data.publicUrl} alt={alt} width="336" height="252" />;
};
