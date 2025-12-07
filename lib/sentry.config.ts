import type { BrowserOptions, NodeOptions } from '@sentry/nextjs';
import { clientEnv } from '@/env/client';

function baseOptions() {
    const env = process.env.NODE_ENV || 'development';
    const isProd = env === 'production';

    return {
        dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN as any, // ensure this key is defined in schema when you add it
        environment: env,
        enabled: isProd,
        sampleRate: isProd ? 1.0 : 0.0,
        tracesSampleRate: isProd ? 0.1 : 0.0,
    } as const;
}

export function getServerSentryOptions(): NodeOptions {
    const base = baseOptions();
    return {
        ...base,
        sendDefaultPii: true,
    } as NodeOptions;
}

export function getEdgeSentryOptions(): NodeOptions {
    const base = baseOptions();
    return {
        ...base,
        sendDefaultPii: true,
    } as NodeOptions;
}

export function getClientSentryOptions(): BrowserOptions {
    const base = baseOptions();
    return {
        ...base,
        sendDefaultPii: true,
    } as BrowserOptions;
}
