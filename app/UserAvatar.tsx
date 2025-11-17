import Image from 'next/image';

// Mutually exclusive props:
// - UrlMode: provide imageUrl (no userId/avatarFileExt)
// - StorageMode: provide userId + avatarFileExt (no imageUrl)
// - PlaceholderMode: provide userId only (no imageUrl, no avatarFileExt)
export type UrlMode = {
    imageUrl: string;
    displayName?: string;
    size?: number;
    className?: string;
};

export type StorageMode = {
    userId: string;
    avatarFileExt: string;
    displayName?: string;
    size?: number;
    className?: string;
};

export type PlaceholderMode = {
    userId: string;
    displayName?: string;
    size?: number;
    className?: string;
};

export type AvatarProps = UrlMode | StorageMode | PlaceholderMode;

export default function UserAvatar(props: AvatarProps) {
    const { size = 32, className = '' } = props as any;

    // Case 0: If a direct imageUrl is provided (e.g., Google photo, local preview), render it directly
    if ('imageUrl' in props && props.imageUrl) {
        const { imageUrl, displayName } = props as UrlMode;
        // Use native <img> for arbitrary remote URLs to avoid Next/Image domain restrictions
        return (
            <img
                src={imageUrl}
                alt={displayName ? `${displayName}'s avatar` : 'User avatar'}
                height={size}
                width={size}
                className={`rounded-full object-cover ${className}`}
            />
        );
    }

    // Case 1: User has uploaded a profile picture
    if ('avatarFileExt' in props && props.avatarFileExt) {
        const { userId, avatarFileExt, displayName } = props as StorageMode;
        // Use shared utility to construct the public URL without requiring a Supabase client
        const { buildAvatarUrlFromEnv, FALLBACK_AVATAR_URL } = require('@/lib/utils/avatar');
        const avatarUrl = buildAvatarUrlFromEnv(userId, avatarFileExt) || FALLBACK_AVATAR_URL;

        return (
            <Image
                src={avatarUrl}
                alt={displayName ? `${displayName}'s avatar` : 'User avatar'}
                height={size}
                width={size}
                className={`rounded-full object-cover ${className}`}
            />
        );
    }

    // Placeholder: gradient/initials from userId
    const { userId, displayName } = props as PlaceholderMode;
    const gradient = generateGradientFromString(userId);

    // Case 2: User has a name (show initials on gradient)
    if (displayName && displayName.trim()) {
        const initials = getInitials(displayName);
        return (
            <div
                className={`rounded-full flex items-center justify-center font-semibold text-white ${className}`}
                style={{
                    width: size,
                    height: size,
                    background: gradient,
                    fontSize: size * 0.4,
                }}
                aria-label={`${displayName}'s avatar`}
            >
                {initials}
            </div>
        );
    }

    // Case 3: No name yet (show PixelPorts icon on gradient)
    return (
        <div
            className={`rounded-full flex items-center justify-center ${className}`}
            style={{
                width: size,
                height: size,
                background: gradient,
            }}
            aria-label="User avatar"
        >
            <svg
                className="text-white"
                style={{ width: size * 0.5, height: size * 0.5 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
            </svg>
        </div>
    );
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

function generateGradientFromString(str: string): string {
    const hash = simpleHash(str);

    // PixelPorts brand colors: Purple/Indigo range (250-280 hue)
    const baseHue = 260; // Indigo-purple
    const hueVariation = 30;

    // Generate two hues within brand range
    const hue1 = baseHue + (Math.abs(hash) % hueVariation);
    const hue2 = baseHue + (Math.abs(hash * 137) % hueVariation); // Golden angle for variety

    // High saturation and moderate lightness for vibrant gradients
    const saturation = 70 + (Math.abs(hash) % 15);
    const lightness = 55 + (Math.abs(hash * 13) % 15);

    return `linear-gradient(135deg, hsl(${hue1}, ${saturation}%, ${lightness}%), hsl(${hue2}, ${saturation}%, ${lightness}%))`;
}

function getInitials(name: string): string {
    if (!name || !name.trim()) return '';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    // First and last initial
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
