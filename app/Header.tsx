import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/consoleUtils';
import UserMenu from './UserMenu';

export default async function Header() {
    const supabase = await createSupabaseClient();

    const {
        data: { user },
        error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
        logger.Error('Error fetching auth user', { userErr });
    }

    // Try to fetch profile only if we have a user
    let profile: { name: string | null; avatar_file_ext: string | null } | null = null;
    if (user) {
        const { data: profileData, error: profileErr } = await supabase
            .from('userprofiles')
            .select('name, avatar_file_ext')
            .eq('id', user.id)
            .maybeSingle();

        if (profileErr) {
            logger.Error('Error fetching user profile', { user, profileErr });
        }

        profile = profileData; // could be null if there is no row yet
    }

    // Build avatar URL safely; fall back if missing
    const avatarExt = profile?.avatar_file_ext ?? null;
    const displayName = profile?.name ?? 'User';
    let avatarFallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
    const avatarUrl =
        user && avatarExt
            ? (supabase.storage.from('avatars').getPublicUrl(`${user.id}.${avatarExt}`).data
                  ?.publicUrl ??
              // fallback if storage is misconfigured
              avatarFallbackUrl)
            : avatarFallbackUrl;

    const NavLinks = () => (
        <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
                <Link
                    href="/discover"
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                    Discover
                </Link>
                <Link
                    href="/browse"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                    Browse
                </Link>
                <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                    About
                </Link>
            </div>
        </div>
    );

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900">
                                <Link href="/" aria-label="PixelPorts - Go to homepage">
                                    PixelPorts
                                </Link>
                            </h1>
                        </div>
                    </div>

                    <NavLinks />

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    href="/upload"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 4v16m8-8H4"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Upload Work
                                </Link>

                                <UserMenu avatarUrl={avatarUrl} displayName={displayName} />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                                >
                                    Join Pixelports
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
