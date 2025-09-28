import Image from 'next/image';

export const ShotThumbnail = ({ src, alt }: { src: string; alt: string }) => {
    return <Image src={src} alt={alt} width={336} height={252} />;
};
