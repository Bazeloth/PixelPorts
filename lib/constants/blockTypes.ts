export const blockTypes = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    image: 'Image',
    carousel: 'Carousel',
    grid: 'Grid gallery',
    'before-after': 'Before/After',
} as const;

export type BlockType = keyof typeof blockTypes;
export type Block = {
    id: string;
    type: BlockType;
    data: any;
};
