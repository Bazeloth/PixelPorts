import type { Metadata } from 'next';
import { Container } from '@/app/Container';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About • PixelPorts',
    description:
        'Learn about PixelPorts — our mission, values, and the inspiration behind the platform for emerging designers.',
    openGraph: {
        title: 'About • PixelPorts',
        description:
            'Learn about PixelPorts — our mission, values, and the inspiration behind the platform for emerging designers.',
        type: 'website',
    },
};

export default function AboutPage() {
    return (
        <main>
            {/* Hero */}
            <section className="bg-white border-b border-gray-200">
                <Container className="mx-auto px-8 py-24 lg:py-32 grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                            Building a stage for emerging designers
                        </h1>
                        <p className="text-lg text-neutral-600 max-w-[620px]">
                            PixelPorts is where new voices get seen. We believe craft should speak
                            louder than follower counts — and that discovery should feel inspiring,
                            fair, and fun.
                        </p>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden ring-1 ring-neutral-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50">
                            <img
                                src="https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=1200&auto=format&fit=crop"
                                alt="Abstract shapes in indigo and amber"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Mission, Values, How it works */}
            <section className="py-20">
                <Container className="px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                                A platform for emerging designers
                            </h2>
                            <p className="text-neutral-600">
                                Let your work speak for itself—we make sure it gets seen. No
                                follower count required.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Values</h2>
                            <ul className="space-y-3 text-neutral-600">
                                <li>
                                    <span className="font-medium text-neutral-900">
                                        Merit over hype.
                                    </span>{' '}
                                    We celebrate thoughtful craft, not follower counts.
                                </li>
                                <li>
                                    <span className="font-medium text-neutral-900">
                                        Kind feedback.
                                    </span>{' '}
                                    Healthy critique grows everyone.
                                </li>
                                <li>
                                    <span className="font-medium text-neutral-900">Clarity.</span>{' '}
                                    Clean presentation and honest attribution.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                                How PixelPorts helps
                            </h2>
                            <ul className="space-y-3 text-neutral-600">
                                <li>Simple, elegant shot pages that put the work first.</li>
                                <li>Thoughtful discovery so great ideas surface quickly.</li>
                                <li>Profiles that track the growth of your design journey.</li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Stats / Highlights */}
            <section className="py-16 bg-white border-y border-gray-200">
                <Container className="px-8">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold text-neutral-900">100%</div>
                            <div className="text-sm text-neutral-500 mt-1">Design-focused</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-neutral-900">∞</div>
                            <div className="text-sm text-neutral-500 mt-1">Room to grow</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-neutral-900">24/7</div>
                            <div className="text-sm text-neutral-500 mt-1">Global access</div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Call to action */}
            <section className="py-20">
                <Container className="text-center px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                        Share your next great idea
                    </h2>
                    <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
                        It takes just a minute to publish your first shot. The best time to start
                        was yesterday; the next best time is now.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Create your profile
                    </Link>
                </Container>
            </section>
        </main>
    );
}
