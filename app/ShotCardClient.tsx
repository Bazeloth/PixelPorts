'use client';

import { type ShotCardProps, ShotCardView } from './ShotCardView';

export default function ShotCardClient(props: ShotCardProps) {
    return <ShotCardView {...props} />;
}
