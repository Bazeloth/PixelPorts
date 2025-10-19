import FeaturedDesigner from '@/app/FeaturedDesigner';
import ShotFilters from '@/app/ShotFilters';
import { Container } from '@/app/Container';
import RecentlyJoined from '@/app/RecentlyJoined';
import ShotsGrid from '@/app/ShotsGrid';

export default async function Home() {
    return (
        <>
            <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-12 pb-20">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Showcase Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Design Journey
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            A platform built for emerging designers. Get discovered, share your
                            process, and grow your career with meaningful exposure.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200 w-full sm:w-auto cursor-pointer">
                                Start Your Portfolio
                            </button>
                            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition duration-200 w-full sm:w-auto cursor-pointer">
                                Explore Designs
                            </button>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-16 bg-white">
                <Container>
                    <FeaturedDesigner />
                </Container>
            </section>

            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover</h2>
                            <p className="text-gray-600">Fresh designs from our community</p>
                        </div>
                        <ShotFilters defaultCategory={'all'} />
                    </div>
                </Container>

                <ShotsGrid initialLimit={12} />
            </section>

            <section className="py-16 bg-white">
                <Container>
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Recently Joined
                            </h2>
                            <p className="text-gray-600">Discover new designers on Pixelports</p>
                        </div>
                    </div>

                    <RecentlyJoined />
                </Container>
            </section>

            <section className="bg-gray-900 py-16">
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
