// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { getClientSentryOptions } from './lib/sentry.config';

const options = getClientSentryOptions();

Sentry.init({
    ...options,
    // Preserve Replay integration and sampling settings
    integrations: [Sentry.replayIntegration()],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

if (options.enabled) {
    console.log('Sentry initialized.');
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
