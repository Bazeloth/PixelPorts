import { CI_ONLY_VARS, RUNTIME_ENV_VARS } from '../env-schema';
import { execa } from 'execa';

// SYNC_ENV can be production|preview|development. Default to production for safety
const ENV =
    (process.env.SYNC_ENV as 'production' | 'preview' | 'development' | undefined) ?? 'production';
const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const ORG_ID = process.env.VERCEL_ORG_ID;

if (!TOKEN || !PROJECT_ID || !ORG_ID) {
    console.error(
        'Missing Vercel credentials. Require VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID in environment.'
    );
    process.exit(1);
}

async function upsertVar(name: string, value: string) {
    if (!value || value.length === 0) {
        console.log(`Skipping ${name} (empty or unset)`);
        return;
    }
    // Remove existing (ignore failures)
    try {
        await execa(
            'npx',
            [
                'vercel@34',
                'env',
                'rm',
                name,
                '--yes',
                '--token',
                TOKEN!,
                '--scope',
                ORG_ID!,
            ],
            { stdio: 'inherit' }
        );
    } catch {
        // ignore
    }
    // Add new value non-interactively using stdin with execa
    await execa(
        'npx',
        [
            'vercel@34',
            'env',
            'add',
            name,
            ENV,
            '--yes',
            '--token',
            TOKEN!,
            '--scope',
            ORG_ID!,
        ],
        {
            stdio: ['pipe', 'inherit', 'inherit'],
            input: value + '\n',
        }
    );
}

async function main() {
    // Determine which vars apply to this environment
    const vars = RUNTIME_ENV_VARS.filter((v) => v.requiredIn.includes(ENV));

    for (const v of vars) {
        const value = process.env[v.name];
        await upsertVar(v.name, value ?? '');
    }

    // Soft-validate CI-only vars so the exported list stays in sync and used.
    const missingCiOnly = CI_ONLY_VARS.filter(
        (name) => !process.env[name] || process.env[name]!.length === 0
    );
    if (missingCiOnly.length) {
        console.log(
            `Note: ${missingCiOnly.length} CI-only vars are not set in this job environment: ${missingCiOnly.join(', ')}`
        );
    }

    console.log(`Synced ${vars.length} variables to Vercel (${ENV}).`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
