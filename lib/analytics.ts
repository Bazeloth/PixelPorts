'use client';

// ============================================
// Lazy-loaded analytics with graceful failure
// ============================================

import { clientEnv } from '@/env/client';

let mixpanel: any = null;
let loading = false;
let loadFailed = false;

const token = clientEnv.NEXT_PUBLIC_MIXPANEL_TOKEN;
const isDev = process.env.NODE_ENV !== 'production';

// ============================================
// Dynamic import for code splitting
// ============================================
async function loadMixpanel() {
    // Already loaded
    if (mixpanel) return mixpanel;

    // Already failed
    if (loadFailed) return null;

    // Currently loading - wait
    if (loading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return loadMixpanel();
    }

    loading = true;

    try {
        // Dynamic import = separate chunk
        const mp = await import('mixpanel-browser');
        mixpanel = mp.default;

        if (!token) {
            if (isDev) console.warn('⚠️ Mixpanel token not set');
            loadFailed = true;
            return null;
        }

        // Initialize
        mixpanel.init(token, {
            api_host: '/api/mixpanel',

            // DISABLE autocapture - be explicit about what you track
            autocapture: false,

            // DISABLE session recording for MVP (privacy + cost)
            // Enable later if needed: record_sessions_percent: 5

            // Better for GDPR
            persistence: 'localStorage',

            // Debug in dev
            debug: isDev,
        });

        console.log('Mixpanel initialized.');

        return mixpanel;
    } catch (error) {
        // Ad blocker or network failure
        loadFailed = true;
        if (isDev) console.warn('⚠️ Mixpanel blocked or failed:', error);
        return null;
    } finally {
        loading = false;
    }
}

// ============================================
// Track events with traffic source
// ============================================
export async function track(event: string, properties: Record<string, any> = {}) {
    try {
        const mp = await loadMixpanel();
        if (!mp) return;

        // Add traffic source if available
        const enrichedProps = {
            ...properties,
            ...getTrafficSource(),
        };

        if (isDev) console.log('[Mixpanel] Track:', event, enrichedProps);

        mp.track(event, enrichedProps);
    } catch (error) {
        // Silent fail in production (don't break app)
        if (isDev) console.warn('[Mixpanel] Track failed:', error);
    }
}

// ============================================
// Identify user
// ============================================
export async function identify(userId: string, properties: Record<string, any> = {}) {
    if (isDev) {
        console.log('[Mixpanel] Identify:', userId, properties);
        return;
    }

    try {
        const mp = await loadMixpanel();
        if (!mp) return;

        mp.identify(userId);

        if (Object.keys(properties).length > 0) {
            mp.people.set(properties);
        }
    } catch (error) {
        if (isDev) console.warn('[Mixpanel] Identify failed:', error);
    }
}

// ============================================
// Alias (link anonymous -> identified user)
// ============================================
export async function alias(userId: string) {
    try {
        const mp = await loadMixpanel();
        if (!mp) return;

        mp.alias(userId);
    } catch (error) {
        if (isDev) console.warn('[Mixpanel] Alias failed:', error);
    }
}

// ============================================
// Set user properties
// ============================================
export async function peopleSet(properties: Record<string, any>) {
    try {
        const mp = await loadMixpanel();
        if (!mp) return;

        mp.people?.set(properties);
    } catch (error) {
        if (isDev) console.warn('[Mixpanel] People set failed:', error);
    }
}

// ============================================
// Reset on logout
// ============================================
export async function reset() {
    try {
        const mp = await loadMixpanel();
        if (!mp) return;

        mp.reset();
        if (isDev) console.log('🔄 Mixpanel reset');
    } catch (error) {
        if (isDev) console.warn('[Mixpanel] Reset failed:', error);
    }
}

// ============================================
// Get traffic source (UTM + referrer)
// ============================================
function getTrafficSource() {
    if (typeof window === 'undefined') return {};

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const referrer = document.referrer;

        const source: Record<string, any> = {};

        // UTM parameters
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');

        if (utmSource) source.utm_source = utmSource;
        if (utmMedium) source.utm_medium = utmMedium;
        if (utmCampaign) source.utm_campaign = utmCampaign;

        // Referrer fallback
        if (referrer && !utmSource) {
            source.referrer = referrer;
            source.referrer_domain = new URL(referrer).hostname;
            source.referrer_source = detectSource(referrer);
        }

        return source;
    } catch (error) {
        return {};
    }
}

// ============================================
// Detect source from referrer
// ============================================
function detectSource(referrer: string): string {
    try {
        const domain = new URL(referrer).hostname.toLowerCase();

        if (domain.includes('reddit.com')) return 'reddit';
        if (domain.includes('twitter.com') || domain.includes('t.co') || domain.includes('x.com'))
            return 'twitter';
        if (domain.includes('linkedin.com')) return 'linkedin';
        if (domain.includes('google.com')) return 'google';
        if (domain.includes('facebook.com')) return 'facebook';
        if (domain.includes('producthunt.com')) return 'producthunt';

        return domain;
    } catch {
        return 'direct';
    }
}

// ============================================
// Pre-load Mixpanel on page load (optional)
// ============================================
export function initMixpanel() {
    if (isDev) return; // Don't load in dev
    loadMixpanel(); // Start loading (doesn't block)
}

// ============================================
// Event names (type-safe)
// ============================================
export const Events = {
    // User events
    UserSignedUp: 'user_signed_up',
    UserFollowed: 'user_followed',

    // Shot events
    ShotUploaded: 'shot_uploaded',
    ShotLiked: 'shot_liked',
    ShotViewed: 'shot_viewed',

    // Interaction events
    CommentCreated: 'comment_created',
    ProfileViewed: 'profile_viewed',

    // Navigation events
    TabSwitched: 'tab_switched',
    FeaturedShotClicked: 'featured_shot_clicked',
    PageViewed: 'page_viewed',
} as const;
