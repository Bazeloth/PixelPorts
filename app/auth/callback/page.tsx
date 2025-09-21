import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/server';

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
}

function candidateUsernames(user: any) {
  const md = (user?.user_metadata ?? {}) as Record<string, any>;
  const email: string | undefined = user?.email ?? md.email;

  const rawCandidates: (string | undefined)[] = [
    md.preferred_username,
    md.user_name,
    md.nickname,
    md.username,
    md.name,
    md.full_name,
    email ? email.split('@')[0] : undefined,
  ];

  const cleaned = rawCandidates
    .filter(Boolean)
    .map((v) => slugify(String(v!).split(' ')[0]))
    .filter((v) => v && !/^\d+$/.test(v) && /[a-z0-9]/.test(v));

  if (cleaned.length === 0) {
    const short = Math.random().toString(36).slice(2, 8);
    cleaned.push(`member-${short}`);
  }

  return Array.from(new Set(cleaned));
}

export default async function OAuthCallbackPage() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: existingProfile } = await supabase
    .from('userprofiles')
    .select('id, username')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingProfile) {
    const tries = candidateUsernames(user);

    let chosen = tries[0];
    outer: for (let i = 0; i < tries.length; i++) {
      const base = tries[i];
      for (let n = 0; n < 10; n++) {
        const attempt = n === 0 ? base : `${base}-${n}`;
        const { data: conflict } = await supabase
          .from('userprofiles')
          .select('id')
          .eq('username', attempt)
          .maybeSingle();
        if (!conflict) {
          chosen = attempt;
          break outer;
        }
      }
    }

    await supabase.from('userprofiles').insert({
      id: user.id,
      username: chosen,
      email: user.email,
    });
  }

  redirect('/');
}
