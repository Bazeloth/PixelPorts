import { ServerEnvSchema } from './schema';

// Load .env files for non-Vercel environments, honoring NODE_ENV-specific files.
// In Vercel, environment variables are injected by the platform; do not load dotenv there.
if (process.env.VERCEL !== '1') {
    // Lazy requires avoid bundling these in edge runtimes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');

    const envName = process.env.NODE_ENV || 'development';
    const cwd = process.cwd();

    // Load order: base -> env -> .local -> env.local (later overrides earlier)
    const files: string[] = [
        path.join(cwd, '.env'),
        path.join(cwd, `.env.${envName}`),
        path.join(cwd, '.env.local'),
        path.join(cwd, `.env.${envName}.local`),
    ];

    for (const file of files) {
        try {
            if (fs.existsSync(file)) {
                dotenv.config({ path: file, override: true });
            }
        } catch {
            // Ignore file access errors; continue loading others
        }
    }
}

const parsed = ServerEnvSchema.safeParse(process.env);

if (!parsed.success) {
    const messages = parsed.error.issues
        .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
    // Throw instead of exiting so callers (like scripts/check-env.ts) can present nicer output
    // Note: Do not import this file from Edge runtime code.
    throw new Error(`Invalid or missing server environment variables:\n${messages}`);
}

export const env = parsed.data;
