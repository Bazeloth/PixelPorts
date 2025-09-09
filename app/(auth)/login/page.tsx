import { signInWithPassword, signOut } from '@/app/(auth)/actions';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
    const supabase = await getSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return (
            <main className="mx-auto max-w-md p-6">
                <h1 className="mb-4 text-2xl font-semibold">You are signed in</h1>
                <p className="mb-6 text-gray-600">Signed in as {user.email}</p>
                <form action={signOut}>
                    <button
                        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        type="submit"
                    >
                        Sign out
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
            <form action={signInWithPassword} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Email or username</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        type="text"
                        name="identifier"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Password</label>
                    <input
                        className="w-full rounded border px-3 py-2"
                        type="password"
                        name="password"
                        required
                    />
                </div>
                <button
                    className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                    type="submit"
                >
                    Sign in
                </button>
            </form>
        </main>
    );
}
