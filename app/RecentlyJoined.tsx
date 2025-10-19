import { loadRecentlyJoined } from '@/lib/recentlyJoined';
import RecentlyJoinedClient from './RecentlyJoinedClient';

export default async function RecentlyJoined() {
  try {
    const users = await loadRecentlyJoined(6);
    return <RecentlyJoinedClient users={users} />;
  } catch (e: any) {
    const msg = e?.message ?? 'Failed to load recently joined';
    return (
      <div className="col-span-full text-center text-sm text-red-600">{msg}</div>
    );
  }
}
