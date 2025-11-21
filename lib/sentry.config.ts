import type { NodeOptions, BrowserOptions } from '@sentry/nextjs';

const DEFAULT_DSN = 'https://bc3c3e43397b0c1f0a993e9eedb1502e@o4510404166221824.ingest.de.sentry.io/4510404168187984';

function baseOptions() {
  const env = process.env.NODE_ENV || 'development';
  const isProd = env === 'production';

  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || DEFAULT_DSN,
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
