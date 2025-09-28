export default async function ShotFilters() {
    return (
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
    );
}
