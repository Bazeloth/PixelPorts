import ShotFilters from '@/app/ShotFilters';
import { Container } from '@/app/Container';
import ShotsGrid from '@/app/ShotsGrid';
import { ArrowRightIcon } from 'lucide-react';
import Icon from '@/app/Icon';
import FaqAccordion from '@/app/FaqAccordion';

export default async function Home() {
    return (
        <>
            <section>
                <Container className="mx-auto px-8 py-32 lg:py-40 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h1 className="text-5xl lg:text-[56px] font-bold leading-tight tracking-tight mb-6">
                            Our mission
                        </h1>
                        <p className="text-neutral-600"></p>
                        <p className="text-lg text-neutral-500 mb-8 max-w-[480px]">
                            Help emerging designers showcase their work, connect with peers, and get
                            discovered by people who value ideas and execution over clout.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#faq-visibility"
                                className="px-5 py-2.5 bg-white text-neutral-900 text-sm font-medium rounded-lg border border-neutral-200 hover:border-neutral-900 transition-colors"
                            >
                                How does it work?
                            </a>
                            <a
                                href="/signup"
                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Get Discovered
                                <Icon
                                    icon={ArrowRightIcon}
                                    size="sm"
                                    className="inline-block ml-2"
                                    ariaLabel="Proceed"
                                />
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&amp;h=360&amp;fit=crop"
                                alt="Featured work"
                                className="w-full h-[360px] object-cover"
                            />
                            <div className="p-6">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-md text-xs font-semibold mb-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-3 h-3"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Featured
                                </span>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                                    Dashboard Analytics Interface
                                </h3>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://i.pravatar.cc/64?img=1"
                                        alt="Designer"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-neutral-900">
                                            Sarah Chen
                                        </div>
                                        <div className="text-xs text-neutral-400">
                                            3 days on PixelPorts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-20 bg-white">
                <Container>
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent</h2>
                            <p className="text-gray-600">Fresh designs from our community</p>
                        </div>
                        <ShotFilters defaultCategory={'all'} />
                    </div>
                </Container>

                <ShotsGrid initialLimit={12} />
            </section>

            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                        Frequently asked questions
                    </h2>
                    <FaqAccordion />
                </div>
            </section>

            <section className="py-20 bg-gray-900">
                <Container className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to showcase your work?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join emerging designers building their careers on Pixelports
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200 cursor-pointer">
                        Start Your Portfolio Today
                    </button>
                </Container>
            </section>

            <footer className="bg-white border-t border-gray-200 py-12">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Pixelports</h3>
                            <p className="text-gray-600 text-sm">
                                The portfolio platform built for emerging designers.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Browse Designs
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Featured Work
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Categories
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">For Designers</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Create Portfolio
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Pro Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Resources
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <a href="/about" className="hover:text-gray-900">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-gray-900">
                                        Privacy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
                        <p>&copy; 2025 Pixelports. All rights reserved.</p>
                    </div>
                </Container>
            </footer>
        </>
    );
}
