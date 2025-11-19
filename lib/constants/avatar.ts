// Shared avatar constraints and allow-lists for both client and server
export const ALLOWED_AVATAR_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'] as const;
export const ALLOWED_AVATAR_MIME = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024; // 5MB
