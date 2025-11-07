export const blockTypes = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    image: 'Image',
    carousel: 'Carousel',
    grid: 'Grid gallery',
    'before-after': 'Before/After',
} as const;

export type BlockType = keyof typeof blockTypes;

export type HeadingData = { text?: string };
export type ParagraphData = { text?: string };
export type ImageData = { image?: string; imageBytes?: number; caption?: string };
export type CarouselData = {
    mainImage?: string;
    mainImageBytes?: number;
    thumbnails?: string[];
    thumbnailSizes?: number[];
};
export type GridData = { images?: string[]; imageSizes?: number[] };
export type BeforeAfterData = {
    beforeImage?: string;
    beforeBytes?: number;
    afterImage?: string;
    afterBytes?: number;
};

export type BlockDataMap = {
    heading: HeadingData;
    paragraph: ParagraphData;
    image: ImageData;
    carousel: CarouselData;
    grid: GridData;
    'before-after': BeforeAfterData;
};

export type Block<T extends BlockType = BlockType> = {
    id: string;
    type: T;
    data: BlockDataMap[T];
};

export type UpdateBlockDataAction<D> = (updater: (data: D) => D) => void;
