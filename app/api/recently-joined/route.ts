import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { formatJoinRelative, pickGradientFromId } from '@/lib/utils/date';
import { initialsFromName } from '@/lib/utils/username';
import type { UIUser } from '@/app/types';

export async function GET() {
  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('userprofiles')
      .select('id, name, username, created_at')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    type Row = {
      id: string;
      name: string | null;
      username: string | null;
      created_at: string;
    };

    const users: UIUser[] = (data ?? []).map((p: Row) => ({
      id: p.id,
      name: p.name ?? 'Unknown',
      username: p.username ?? 'unknown',
      joinedLabel: formatJoinRelative(p.created_at),
      initials: initialsFromName(p.name ?? p.username ?? ''),
      gradient: pickGradientFromId(p.id),
    }));

    return NextResponse.json({ users });
  } catch (e: any) {
    const msg = e?.message ?? 'Failed to load recently joined';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
