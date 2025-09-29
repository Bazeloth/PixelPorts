import { useUser } from '@/lib/supabase/UserContext';

export async function UserAvatar() {
    const user = useUser();

    if (!user) {
        return <div>Error fetching user data</div>;
    }
}
