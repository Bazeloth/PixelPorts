'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MixpanelProvider from '@/app/MixpanelProvider';
import { UploadActionsProvider } from './upload/UploadActionsContext';

export default function Providers({ children }: PropsWithChildren) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60_000,
                        gcTime: 5 * 60_000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <UploadActionsProvider>
            <MixpanelProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </MixpanelProvider>
        </UploadActionsProvider>
    );
}
