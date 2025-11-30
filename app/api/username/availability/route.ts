import { NextResponse } from 'next/server';
import { validateUsername } from '@/lib/utils/username';
import { createSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('u') ?? '';

    const res = validateUsername(username);
    if (!res.ok) {
        return NextResponse.json({ ok: false, error: res.error }, { status: 400 });
    }

    const supabase = await createSupabaseClient();
    const { count, error } = await supabase
        .from('userprofiles')
        .select('*', { count: 'exact', head: true })
        .ilike('username', res.value);

    if (error) {
        return NextResponse.json({ ok: false, error: 'something went wrong' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, available: count === 0 });
}
