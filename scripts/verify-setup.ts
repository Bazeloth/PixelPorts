import { execaCommand } from 'execa';
import fs from 'fs-extra';
import path from 'path';

async function checkCommand(command: string): Promise<boolean> {
    try {
        await execaCommand(`${command} --version`, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function checkDockerRunning(): Promise<boolean> {
    try {
        await execaCommand('docker ps', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

async function checkSupabaseRunning(): Promise<boolean> {
    try {
        const { stdout } = await execaCommand('docker ps');
        return stdout.includes('supabase');
    } catch (error) {
        return false;
    }
}

async function getStorageVolume(): Promise<string | null> {
    try {
        const { stdout } = await execaCommand(
            'docker volume ls --filter "name=supabase_storage" --format "{{.Name}}"'
        );
        const volumes = stdout.split('\n').filter(Boolean);
        return volumes[0] || null;
    } catch (error) {
        return null;
    }
}

async function verifySetup() {
    console.log('🔍 Verifying Supabase Snapshot Setup');
    console.log('');

    // Check if scripts exist
    console.log('Checking scripts...');
    const scripts = ['snapshot.ts', 'restore.ts', 'list-snapshots.ts'];
    let allFound = true;

    for (const script of scripts) {
        const scriptPath = path.join('scripts', script);
        const exists = await fs.pathExists(scriptPath);

        if (exists) {
            console.log(`  ✅ ${scriptPath}`);
        } else {
            console.log(`  ❌ ${scriptPath} - NOT FOUND`);
            allFound = false;
        }
    }

    console.log('');

    // Check dependencies
    console.log('Checking Node.js dependencies...');
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJSON(packageJsonPath);
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        const requiredDeps = ['execa', 'fs-extra', 'tsx'];
        for (const dep of requiredDeps) {
            if (deps[dep]) {
                console.log(`  ✅ ${dep} installed`);
            } else {
                console.log(`  ❌ ${dep} not installed`);
                console.log(`     Run: npm install ${dep}`);
            }
        }
    } else {
        console.log('  ⚠️  package.json not found');
    }

    console.log('');

    // Check external dependencies
    console.log('Checking external dependencies...');

    const hasSupabase = await checkCommand('supabase');
    if (hasSupabase) {
        const { stdout } = await execaCommand('supabase --version');
        console.log(`  ✅ Supabase CLI installed - ${stdout.trim()}`);
    } else {
        console.log('  ❌ Supabase CLI not found');
        console.log('     Install: https://supabase.com/docs/guides/cli');
    }

    const hasDocker = await checkDockerRunning();
    if (hasDocker) {
        console.log('  ✅ Docker is running');
    } else {
        console.log('  ❌ Docker is not running or not accessible');
    }

    const hasPsql = await checkCommand('docker exec supabase_db_Savannah psql -U postgres');
    if (hasPsql) {
        console.log('  ✅ PostgreSQL client (psql) installed');
    } else {
        console.log('  ⚠️  PostgreSQL client (psql) not found');
        console.log('     This is needed for database restore');
    }

    console.log('');

    // Check if Supabase is running
    const supabaseRunning = await checkSupabaseRunning();
    if (supabaseRunning) {
        console.log('  ✅ Supabase containers are running');

        // Check for storage volume
        const storageVolume = await getStorageVolume();
        if (storageVolume) {
            console.log(`  ✅ Storage volume found: ${storageVolume}`);
        } else {
            console.log('  ⚠️  Storage volume not found (might not exist yet)');
        }
    } else {
        console.log('  ⚠️  Supabase containers not running');
        console.log('     Start with: supabase start');
    }

    console.log('');

    // Check package.json scripts
    if (await fs.pathExists(packageJsonPath)) {
        console.log('Checking package.json scripts...');
        const packageJson = await fs.readJSON(packageJsonPath);

        const requiredScripts = ['snapshot', 'restore', 'snapshots'];
        for (const scriptName of requiredScripts) {
            if (packageJson.scripts && packageJson.scripts[scriptName]) {
                console.log(`  ✅ '${scriptName}' script found`);
            } else {
                console.log(`  ⚠️  '${scriptName}' script not found in package.json`);
            }
        }
    } else {
        console.log('  ⚠️  package.json not found');
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (allFound) {
        console.log('✅ Setup verification complete!');
        console.log('');
        console.log('Try creating your first snapshot:');
        console.log('  npm run snapshot');
    } else {
        console.log('⚠️  Some issues found. Please review the output above.');
    }
}

verifySetup();
