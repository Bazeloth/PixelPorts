export type ShotUpload = {
    id: string;
    file_type: string;
    width: number | null;
    height: number | null;
    file_ext: string;
    file_size: number;
};

export type CarouselUpload = {
    position: number;
    upload_id: string;
    upload: ShotUpload;
};

export type ShotBlock = {
    id: string;
    type: 'image' | 'text' | 'carousel';
    position: number;
    title?: string; // Optional title for any block type
    subtitle?: string;
    content?: string | null; // For text blocks
    upload?: ShotUpload; // For image blocks
    carousel_uploads?: CarouselUpload[]; // For carousel blocks
};

export type ShotAuthor = {
    id: string;
    username: string;
    name: string;
    avatar_file_ext?: string | null;
    avatar_updated_at?: string | null;
};

export type ShotCard = {
    id: string;
    author: ShotAuthor;
    title: string;
    subtitle?: string;
    alt: string;
    created_at: string;
    published_at: string;
    thumbnail_src: string;
    blocks: ShotBlock[];
};
