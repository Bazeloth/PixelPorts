import Image from 'next/image';
import UserAvatar from '@/app/UserAvatar';

export type ShotCardProps = {
    title: string;
    description: string;
    tags: string[];
    designer: { name: string; userId: string; avatarFileExt: string };
    image: { src: string; alt: string };
};

export function ShotCardView({ title, description, tags, designer, image }: ShotCardProps) {
    const avatarProps = designer.avatarFileExt
        ? {
              userId: designer.userId,
              avatarFileExt: designer.avatarFileExt,
              displayName: designer.name,
          }
        : { userId: designer.userId, displayName: designer.name }; // placeholder

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer flex flex-col">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden w-full aspect-[4/3]">
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                    priority={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-1">{description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <div className="flex items-center">
                        <UserAvatar {...avatarProps} />
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
