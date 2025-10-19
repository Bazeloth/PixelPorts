import ShotFilters from '@/app/ShotFilters';
import ShotCard from '@/app/ShotCard';
import { notFound } from 'next/navigation';
import { recentlyJoinedMockUsers } from './recentlyJoined.mock';

export default function DevComponentsPage() {
    // Only allow this page in development to avoid exposing internal gallery in production
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) return notFound();

    return (
        <main className="p-6 grid gap-8">
            {/* Disable animations/transitions for stable visual snapshots */}
            <style>{`*{animation:none !important; transition:none !important}`}</style>

            <section>
                <h2 className="text-sm font-semibold mb-2">ShotFilters</h2>
                <div className="flex items-center gap-4 flex-wrap">
                    <ShotFilters defaultCategory="all" />
                    <ShotFilters defaultCategory="uiux" />
                    <ShotFilters defaultCategory="branding" />
                </div>
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-2">ShotCard</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <ShotCard
                        title="Banking App UI"
                        description="A modern banking app with clean typography and spacing."
                        tags={['UI/UX', 'Mobile']}
                        designer={{
                            name: 'Alina Chen',
                            src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=60',
                        }}
                        image={{
                            src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
                            alt: 'Banking App UI',
                        }}
                    />
                    <ShotCard
                        title="Brand System"
                        description="A bold identity with geometric forms and versatile lockups."
                        tags={['Branding', 'Web']}
                        designer={{
                            name: 'Moh Khan',
                            src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60',
                        }}
                        image={{
                            src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop',
                            alt: 'Brand System',
                        }}
                    />
                </div>
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-2">RecentlyJoined (mock)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentlyJoinedMockUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100"
                        >
                            <div className="relative inline-block mb-4">
                                <div
                                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center text-white text-3xl font-semibold`}
                                >
                                    {user.initials}
                                </div>
                                <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full border-2 border-white uppercase">
                                    New
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{user.title}</p>
                            <p className="text-xs text-gray-400 mb-4">Joined {user.joined}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
