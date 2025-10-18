import FeaturedDesigner from '@/app/FeaturedDesigner';
import ShotCard from '@/app/ShotCard';
import ShotFilters from '@/app/ShotFilters';
import { Container } from '@/app/Container';
import RecentlyJoined from '@/app/RecentlyJoined';

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

            <FeaturedDesigner />

            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover</h2>
                            <p className="text-gray-600">Fresh designs from our community</p>
                        </div>
                        <ShotFilters defaultCategory={'all'} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ShotCard
                            title={'Banking App Redesign'}
                            description={'Modern take on mobile banking with improved UX flow'}
                            tags={['Mobile design', 'UI/UX']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                name: 'Alex Rivera',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80',
                                alt: 'Banking App Redesign',
                            }}
                        />

                        <ShotCard
                            title={'E-commerce Platform'}
                            description={'Clean, conversion-focused design for fashion retail'}
                            tags={['Web Design', 'E-commerce']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                                name: 'Maya Patel',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=739&q=80',
                                alt: 'E-commerce Platform',
                            }}
                        />

                        <ShotCard
                            title={'Sustainable Brand Identity'}
                            description={'Eco-friendly startup complete brand package'}
                            tags={['Branding', 'Identity']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                                name: 'Jordan Kim',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                                alt: 'Sustainable Brand Identity',
                            }}
                        />

                        <ShotCard
                            title={'Food Delivery App'}
                            description={'Streamlined ordering experience with local focus'}
                            tags={['Mobile design', 'Product design']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
                                name: 'Emma Chen',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80',
                                alt: 'Food Delivery App',
                            }}
                        />

                        <ShotCard
                            title={'SaaS Dashboard'}
                            description={'Analytics platform with intuitive data visualization'}
                            tags={['Web Design', 'Dashboard']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                name: 'David Park',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                                alt: 'SaaS Dashboard',
                            }}
                        />

                        <ShotCard
                            title={'Medical App Interface'}
                            description={'Patient-focused healthcare management system'}
                            tags={['Mobile design', 'Healthcare']}
                            designer={{
                                src: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                                name: 'Lisa Wong',
                            }}
                            image={{
                                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                                alt: 'Medical App Interface',
                            }}
                        />
                    </div>

                    <div className="text-center mt-12">
                        <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
                            Load More Designs
                        </button>
                    </div>
                </Container>
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
