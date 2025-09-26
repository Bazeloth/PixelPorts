import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/consoleUtils';
import { redirect } from 'next/navigation';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';

function UsernameControl() {
    return (
        <div className="relative">
            <div className="flex rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <span className="inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    PixelPorts.com/
                </span>
                <input
                    type="text"
                    className="flex-1 rounded-r-md border-0 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                />
            </div>
        </div>
    );
}

export default async function CompleteProfilePage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        logger.Info('User not logged in', { user });
        redirect('/');
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start">
                <FieldLabel label="Username" sublabel="A unique name for your profile." />
                <UsernameControl />
            </div>
        </div>
    );
}
