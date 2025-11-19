import { z } from 'zod';
import { USERNAME_CONSTRAINTS } from '@/lib/constants/username';
import { ALLOWED_AVATAR_EXTENSIONS } from '@/lib/constants/avatar';

// Coerce the readonly extensions array into a tuple type acceptable for z.enum
// This avoids TypeScript complaining that z.enum expects a tuple [string, ...string[]]
// while our constant is a readonly string literal array.
type AvatarExt = typeof ALLOWED_AVATAR_EXTENSIONS[number];
const AVATAR_EXTENSIONS_TUPLE = ALLOWED_AVATAR_EXTENSIONS as readonly [AvatarExt, ...AvatarExt[]];

// Username: trim, validate, and normalize to lowercase for case-insensitive uniqueness
export const usernameSchema = z
  .string()
  .trim()
  .min(
    USERNAME_CONSTRAINTS.minLength,
    `Username must be at least ${USERNAME_CONSTRAINTS.minLength} characters`
  )
  .max(
    USERNAME_CONSTRAINTS.maxLength,
    `Username must be less than ${USERNAME_CONSTRAINTS.maxLength} characters`
  )
  .regex(
    USERNAME_CONSTRAINTS.pattern,
    'Only letters, numbers, and underscores allowed'
  )
  .toLowerCase();

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Full name is required')
  .max(60, 'Full name must be between 1 and 60 characters');

export const avatarFileExtSchema = z
  .union([z.literal(''), z.enum(AVATAR_EXTENSIONS_TUPLE)]);

export const createProfileSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  avatar_file_ext: avatarFileExtSchema.optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
