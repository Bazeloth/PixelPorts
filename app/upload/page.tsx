import { redirect } from 'next/navigation';
import { getUserAndProfile } from '@/lib/supabase/getUserAndProfile';
import UploadClientPage from '@/app/upload/UploadClientPage';

export const dynamic = 'force-dynamic';

export default async function UploadPage() {
    const user = await getUserAndProfile();

    // Require both a logged-in user and an existing userprofile
    if (!user || !user.profile) {
        redirect('/');
    }

    return <UploadClientPage />;
}
