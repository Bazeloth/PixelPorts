export default async function Home() {
    return (
        <>
            <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-12 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200 w-full sm:w-auto">
                                Start Your Portfolio
                            </button>
                            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition duration-200 w-full sm:w-auto">
                                Explore Designs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Designer</h2>
                        <p className="text-gray-600">Spotlighting exceptional emerging talent</p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="lg:w-1/3 mb-8 lg:mb-0">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                    alt="Featured Designer"
                                    className="w-32 h-32 rounded-full mx-auto border-4 border-white/20"
                                />
                                <h3 className="text-xl font-semibold mt-4 text-center">
                                    Sarah Chen
                                </h3>
                                <p className="text-indigo-100 text-center">UI/UX Designer</p>
                                <div className="flex justify-center mt-2">
                                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                        Bootcamp Graduate
                                    </span>
                                </div>
                            </div>
                            <div className="lg:w-2/3 lg:pl-8">
                                <h4 className="text-2xl font-bold mb-4">
                                    EcoTrack - Sustainability App
                                </h4>
                                <p className="text-indigo-100 mb-6">
                                    A comprehensive mobile app helping users track their
                                    environmental impact and make sustainable choices. Features
                                    include carbon footprint calculator, eco-friendly product
                                    recommendations, and community challenges.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-white/20 text-sm px-3 py-1 rounded-full">
                                        Mobile Design
                                    </span>
                                    <span className="bg-white/20 text-sm px-3 py-1 rounded-full">
                                        User Research
                                    </span>
                                    <span className="bg-white/20 text-sm px-3 py-1 rounded-full">
                                        Prototyping
                                    </span>
                                </div>
                                <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
                                    View Full Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Work</h2>
                            <p className="text-gray-600">Fresh designs from our community</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition duration-200">
                                All
                            </button>
                            <button className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition duration-200">
                                UI/UX
                            </button>
                            <button className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition duration-200">
                                Branding
                            </button>
                            <button className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition duration-200">
                                Web
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80"
                                    alt="Design"
                                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Banking App Redesign
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Modern take on mobile banking with improved UX flow
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Alex Rivera</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-16 bg-gradient-to-br from-purple-400 to-pink-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=739&q=80"
                                    alt="Design"
                                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    E-commerce Platform
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Clean, conversion-focused design for fashion retail
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Maya Patel</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">18</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-10 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1586717799252-bd134ad00e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                    alt="Design"
                                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Sustainable Brand Identity
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Eco-friendly startup complete brand package
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Jordan Kim</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">31</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-14 bg-gradient-to-br from-orange-400 to-red-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80"
                                    alt="Design"
                                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Food Delivery App
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Streamlined ordering experience with local focus
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Emma Chen</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">15</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-indigo-400 to-purple-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                    alt="Design"
                                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">SaaS Dashboard</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Analytics platform with intuitive data visualization
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">David Park</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">27</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
                            <div className="aspect-w-16 aspect-h-10 bg-gradient-to-br from-teal-400 to-blue-600 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                    alt="Design"
                                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Medical App Interface
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Patient-focused healthcare management system
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                            alt="Designer"
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Lisa Wong</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                                        </svg>
                                        <span className="text-sm">19</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
                            Load More Designs
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to showcase your work?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of emerging designers building their careers on Pixelports
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition duration-200">
                        Start Your Portfolio Today
                    </button>
                </div>
            </section>

            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                </div>
            </footer>
        </>
    );
}
