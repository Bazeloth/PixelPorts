'use client';

import { ShotCardView, type ShotCardProps } from './ShotCardView';

export default function ShotCardClient(props: ShotCardProps) {
    return <ShotCardView {...props} />;
}
