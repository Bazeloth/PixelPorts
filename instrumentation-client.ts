// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { getClientSentryOptions } from './lib/sentry.config';

const clientOptions = getClientSentryOptions();

Sentry.init({
    ...clientOptions,
    // Preserve Replay integration and sampling settings
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
