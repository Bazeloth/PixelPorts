export type ShotCardProps = {
    title: string;
    description: string;
    designer: ShotCardDesignersProps;
    image: ShotCardImageProps;
};

export type ShotCardImageProps = {
    src: string;
    alt: string;
};

export type ShotCardDesignersProps = {
    name: string;
    src: string;
};

export default async function ShotCard({ title, description, designer, image }: ShotCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
            <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={designer.src}
                            alt={designer.name}
                            className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-700">{designer.name}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                        </svg>
                        <span className="text-sm">24</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
