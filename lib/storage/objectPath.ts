export type ShotImageVariant = 'original' | 'thumb' | string;

/**
 * Build a deterministic object path for a shot image stored in the `shots` bucket.
 * Example: "<userId>/<shotId>/<hash>-<variant>.<ext>"
 */
export function getShotObjectPath(args: {
  userId: string;
  shotId: string;
  hash: string;
  variant: ShotImageVariant; // e.g., 'original' | 'thumb'
  ext: string; // with or without leading dot
}): string {
  const { userId, shotId, hash, variant, ext } = args;
  const safeExt = ext.startsWith('.') ? ext.slice(1) : ext;
  const suffix = String(variant).trim();
  return `${userId}/${shotId}/${hash}-${suffix}.${safeExt}`;
}
