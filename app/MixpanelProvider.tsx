'use client';

import { PropsWithChildren, useEffect } from 'react';
import { initMixpanel } from '@/lib/analytics';

export default function MixpanelProvider({ children }: PropsWithChildren) {
    useEffect(() => {
        initMixpanel();
    }, []);

    return <>{children}</>;
}
