import { NextResponse } from 'next/server';
import { createSupabaseClient, StorageBucket } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const src = url.searchParams.get('src');
        if (!src) return NextResponse.json({ error: 'Missing src' }, { status: 400 });

        const supabase = await createSupabaseClient();
        const {
            data: { user },
            error: userErr,
        } = await supabase.auth.getUser();
        if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const res = await fetch(src);
        if (!res.ok) return NextResponse.json({ error: 'Fetch failed' }, { status: 400 });

        const contentType = res.headers.get('content-type') || 'image/jpeg';
        const arrayBuf = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuf);

        const ext = contentType.includes('png')
            ? 'png'
            : contentType.includes('webp')
              ? 'webp'
              : contentType.includes('gif')
                ? 'gif'
                : 'jpg';

        const path = `${user.id}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from(StorageBucket.Avatars)
            .upload(path, buf, {
                cacheControl: '3600',
                upsert: true,
                contentType,
            });

        if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

        return NextResponse.json({ fileExt: ext });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
    }
}
