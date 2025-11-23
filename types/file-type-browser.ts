// TypeScript shim for 'file-type/browser' subpath export.
// The package provides runtime code but lacks an explicit types export for this subpath
// under TS moduleResolution "bundler". This bridges the types from the main entry.

declare module 'file-type/browser' {
  import type { FileTypeResult } from 'file-type';
  export function fileTypeFromBlob(blob: Blob): Promise<FileTypeResult | undefined>;
  export type { FileTypeResult };
}
