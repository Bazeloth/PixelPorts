export default async function FeaturedDesigner() {
    return (
        <>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Designer</h2>
                <p className="text-gray-600">Spotlighting exceptional emerging talent</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/3 mb-8 lg:mb-0">
                        <img
                            src="https://images.unsplash.com/profile-1495427732560-fe5248ad6638?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=687&dpr=1&crop=face"
                            alt="Featured Designer"
                            className="w-32 h-32 rounded-full mx-auto border-4 border-white/20"
                        />
                        <h3 className="text-xl font-semibold mt-4 text-center">Sarah Chen</h3>
                        <p className="text-indigo-100 text-center">UI/UX Designer</p>
                        <div className="flex justify-center mt-2">
                            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                Bootcamp Graduate
                            </span>
                        </div>
                    </div>
                    <div className="lg:w-2/3 lg:pl-8">
                        <h4 className="text-2xl font-bold mb-4">EcoTrack - Sustainability App</h4>
                        <p className="text-indigo-100 mb-6">
                            A comprehensive mobile app helping users track their environmental
                            impact and make sustainable choices. Features include carbon footprint
                            calculator, eco-friendly product recommendations, and community
                            challenges.
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
                        <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-200 cursor-pointer">
                            View Full Project
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
