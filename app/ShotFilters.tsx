export default async function ShotFilters() {
    return (
        <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-200">
            <button className="px-4 py-1.5 rounded-md font-medium transition-all text-xs bg-indigo-600 text-white">
                All
            </button>
            <button className="px-4 py-1.5 rounded-md font-medium transition-all text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                UI/UX
            </button>
            <button className="px-4 py-1.5 rounded-md font-medium transition-all text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                Branding
            </button>
            <button className="px-4 py-1.5 rounded-md font-medium transition-all text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">
                Web
            </button>
        </div>
    );
}
