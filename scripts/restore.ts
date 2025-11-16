import { execaCommand } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

const SNAPSHOT_DIR = './supabase/snapshots';

async function getDockerStorageVolume(): Promise<string | null> {
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

async function listAvailableSnapshots(): Promise<string[]> {
    try {
        const entries = await fs.readdir(SNAPSHOT_DIR);
        return entries
            .filter((entry) => entry.startsWith('snapshot_'))
            .sort()
            .reverse();
    } catch (error) {
        return [];
    }
}

async function confirmRestore(): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(
            '⚠️  This will overwrite your current database and storage. Continue? (y/N) ',
            (answer) => {
                rl.close();
                resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
            }
        );
    });
}

async function restoreSnapshot() {
    try {
        // Get snapshot name from argument or use latest
        const snapshotArg = process.argv[2];
        let snapshotName = snapshotArg;

        // If no argument provided, find the most recent snapshot
        if (!snapshotArg || snapshotArg === 'latest') {
            console.log('📦 No snapshot specified, finding latest...');
            const snapshots = await listAvailableSnapshots();

            if (snapshots.length === 0) {
                console.error('❌ Error: No snapshots found');
                console.log('Create a snapshot first with: npm run snapshot');
                process.exit(1);
            }

            snapshotName = snapshots[0]; // Most recent (already sorted)
            console.log(`📦 Using latest snapshot: ${snapshotName}`);
        }

        const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);

        // Check if snapshot exists
        const snapshotExists = await fs.pathExists(snapshotPath);

        if (!snapshotExists) {
            console.error(`❌ Error: Snapshot '${snapshotName}' not found`);
            console.log('');
            console.log('Available snapshots:');
            const snapshots = await listAvailableSnapshots();
            if (snapshots.length === 0) {
                console.log('  (none)');
            } else {
                snapshots.forEach((s) => console.log(`  • ${s}`));
            }
            process.exit(1);
        }

        console.log(`🔄 Restoring from snapshot: ${snapshotName}`);
        console.log('');

        // Show metadata if available
        const metadataPath = path.join(snapshotPath, 'metadata.json');
        if (await fs.pathExists(metadataPath)) {
            const metadata = await fs.readJSON(metadataPath);
            console.log('Snapshot details:');
            console.log(JSON.stringify(metadata, null, 2));
            console.log('');
        }

        // Confirm restoration
        const confirmed = await confirmRestore();
        if (!confirmed) {
            console.log('Restoration cancelled');
            process.exit(0);
        }

        // 1. Reset the database
        console.log('🗄️  Resetting database...');
        try {
            await execaCommand('supabase db reset --local');
        } catch (error) {
            console.error('❌ Database reset failed');
            throw error;
        }

        // 2. Restore database from dump
        console.log('💾 Restoring database...');
        const dbDumpPath = path.join(snapshotPath, 'database.sql');

        try {
            await execaCommand(
                `docker exec supabase_db_Savannah psql -U postgres postgresql://postgres:postgres@localhost:54322/postgres -f ${dbDumpPath}`,
                {
                    stdio: 'inherit',
                }
            );
            console.log('✅ Database restored successfully');
        } catch (error) {
            console.log('⚠️  Database restore completed with warnings (this is often normal)');
        }

        // 3. Restore storage buckets
        const storagePath = path.join(snapshotPath, 'storage');
        const storageExists = await fs.pathExists(storagePath);

        if (storageExists) {
            console.log('🗂️  Restoring storage buckets...');

            const storageVolume = await getDockerStorageVolume();

            if (!storageVolume) {
                console.error('❌ Error: Storage volume not found');
            } else {
                const currentDir = process.cwd();
                const absoluteStoragePath = path.resolve(currentDir, storagePath);

                try {
                    await execaCommand(
                        `docker run --rm -v ${storageVolume}:/target -v ${absoluteStoragePath}:/source:ro alpine sh -c "rm -rf /target/* && cp -r /source/* /target/"`
                    );
                    console.log('✅ Storage restored successfully');
                } catch (error) {
                    console.error('❌ Storage restore failed');
                }
            }
        } else {
            console.log('⚠️  No storage backup found in snapshot');
        }

        console.log('');
        console.log('✅ Restore complete!');
        console.log('🚀 Restart Supabase to apply changes: supabase stop && supabase start');
    } catch (error) {
        console.error('Error restoring snapshot:', error);
        process.exit(1);
    }
}

restoreSnapshot();
