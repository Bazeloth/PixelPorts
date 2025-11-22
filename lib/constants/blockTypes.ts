export const blockTypes = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    caption: 'Caption',
    quote: 'Quote',
    image: 'Image',
    carousel: 'Carousel',
    grid: 'Grid gallery',
    'before-after': 'Before/After',
} as const;

export type BlockType = keyof typeof blockTypes;
export type BlockTypeAlignment = 'left' | 'center' | 'right';

export type TextBlockData = { text?: string; align?: BlockTypeAlignment };
export type HeadingData = TextBlockData;
export type ParagraphData = TextBlockData;
export type CaptionData = TextBlockData;
export type QuoteData = TextBlockData;
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
    caption: CaptionData;
    quote: QuoteData;
    image: ImageData;
    carousel: CarouselData;
    grid: GridData;
    'before-after': BeforeAfterData;
};

export type BlockOf<T extends BlockType> = {
    id: string;
    type: T;
    data: BlockDataMap[T];
};

export type Block = {
    [K in BlockType]: BlockOf<K>;
}[BlockType];

export type UpdateBlockDataAction<D> = (updater: (data: D) => D) => void;

export type BlockComponentProps<T extends BlockType> = {
    block: BlockOf<T>;
    onRemoveAction: () => void;
    updateBlockDataAction: UpdateBlockDataAction<BlockDataMap[T]>;
};
