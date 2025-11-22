import { NextRequest } from 'next/server';
import { clientEnv } from '@/env/client';

const MIXPANEL_API_HOST = clientEnv.NEXT_PUBLIC_MIXPANEL_API_HOST;

function buildTargetUrl(req: NextRequest, pathSegments: string[]) {
    const search = req.nextUrl.search || '';
    const base = MIXPANEL_API_HOST.replace(/\/+$/, '');
    const path = (pathSegments || []).join('/');
    return `${base}/${path}${search}`;
}

const hopByHopHeaders = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'host',
]);

function filterHeaders(headers: Headers) {
    const out = new Headers();
    headers.forEach((value, key) => {
        if (!hopByHopHeaders.has(key.toLowerCase())) {
            out.set(key, value);
        }
    });
    return out;
}

async function proxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
    const { path = [] } = await paramsPromise;
    const url = buildTargetUrl(req, path || []);
    const method = req.method.toUpperCase();

    const init: RequestInit = {
        method,
        headers: filterHeaders(req.headers),
        cache: 'no-store',
        redirect: 'manual',
    };

    if (method !== 'GET' && method !== 'HEAD') {
        const body = await req.arrayBuffer();
        init.body = body;
    }

    try {
        const upstream = await fetch(url, init);
        const headers = filterHeaders(upstream.headers);
        const buffer = await upstream.arrayBuffer();
        return new Response(buffer, { status: upstream.status, headers });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: 'Upstream request failed' }), {
            status: 502,
            headers: { 'content-type': 'application/json' },
        });
    }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxy(req, context.params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxy(req, context.params);
}
