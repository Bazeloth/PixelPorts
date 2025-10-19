import { NextResponse } from 'next/server';
import { loadRecentlyJoined } from '@/lib/recentlyJoined';

export async function GET() {
  try {
    const users = await loadRecentlyJoined(6);
    return NextResponse.json({ users });
  } catch (e: any) {
    const msg = e?.message ?? 'Failed to load recently joined';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
