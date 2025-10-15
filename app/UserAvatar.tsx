import { getUserAndProfile } from '@/lib/supabase/getUserAndProfile';
import Image from 'next/image';

export type AvatarProps = {
    /** User ID (used for gradient seed and avatar URL construction) */
    userId: string;
    /** User's full name (for initials) */
    displayName?: string;
    /** Avatar file extension if uploaded (e.g., 'png', 'jpg', 'webp') */
    avatarFileExt?: string | null;
    /** Size in pixels */
    size?: number;
    /** Additional CSS classes */
    className?: string;
};

export default function UserAvatar({
    userId,
    displayName,
    avatarFileExt,
    size = 32,
    className = '',
}: AvatarProps) {
    // Case 1: User has uploaded a profile picture
    if (avatarFileExt) {
        const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userId}.${avatarFileExt}`; // todo: replace with api call from supabase client

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

    // Generate gradient from userId
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
