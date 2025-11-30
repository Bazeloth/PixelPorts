import type { HTMLAttributes, ElementType } from 'react';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    as?: ElementType; // optional semantic tag override
};

export function Container({ as: Tag = 'div', className = '', ...props }: ContainerProps) {
    const base = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
    return <Tag className={`${base} ${className}`} {...props} />;
}
