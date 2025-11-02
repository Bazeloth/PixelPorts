// Shared username constraints for both client and server
// Keep these as the single source of truth to avoid drift between UI and validation.

export const USERNAME_CONSTRAINTS = {
    minLength: 3,
    maxLength: 20,
    // Allow letters (both cases), numbers, and underscores.
    pattern: /^[a-zA-Z0-9_]+$/,
} as const;
