import { execaCommand } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const SNAPSHOT_DIR = './supabase/snapshots';
const MAX_SNAPSHOTS = 10;

async function getTimestamp(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

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

async function getSupabaseVersion(): Promise<string> {
    try {
        const { stdout } = await execaCommand('supabase --version');
        return stdout.trim();
    } catch (error) {
        return 'unknown';
    }
}

async function createSnapshot() {
    try {
        const timestamp = await getTimestamp();
        const snapshotName = `snapshot_${timestamp}`;
        const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);

        console.log(`📸 Creating Supabase snapshot: ${snapshotName}`);

        // Create snapshot directory
        await fs.ensureDir(snapshotPath);

        // 1. Dump the database (from local Docker instance)
        console.log('💾 Backing up database...');
        const dbDumpPath = path.join(snapshotPath, 'database.sql');

        try {
            await execaCommand(`supabase db dump --local -f ${dbDumpPath}`);
            console.log('✅ Database backed up successfully');
        } catch (error) {
            console.error('❌ Database dump failed');
            throw error;
        }

        // 2. Export storage buckets
        console.log('🗂️  Backing up storage buckets...');
        const storageVolume = await getDockerStorageVolume();

        if (!storageVolume) {
            console.log('⚠️  Warning: Storage volume not found. Skipping storage backup.');
        } else {
            const storagePath = path.join(snapshotPath, 'storage');
            await fs.ensureDir(storagePath);

            const currentDir = process.cwd();
            const absoluteStoragePath = path.resolve(currentDir, storagePath);

            try {
                await execaCommand(
                    `docker run --rm -v ${storageVolume}:/source:ro -v ${absoluteStoragePath}:/backup alpine sh -c "cp -r /source/* /backup/ 2>/dev/null || mkdir -p /backup"`
                );
                console.log('✅ Storage backed up successfully');
            } catch (error) {
                console.log('⚠️  Warning: Storage backup may be incomplete');
            }
        }

        // 3. Save metadata
        console.log('📝 Saving snapshot metadata...');
        const metadata = {
            timestamp,
            date: new Date().toISOString(),
            supabase_version: await getSupabaseVersion(),
        };

        await fs.writeJSON(path.join(snapshotPath, 'metadata.json'), metadata, { spaces: 2 });

        // 4. Try to create a latest symlink (may not work on Windows without admin/dev mode)
        const latestPath = path.join(SNAPSHOT_DIR, 'latest');
        try {
            await fs.remove(latestPath);
            await fs.symlink(snapshotName, latestPath);
            console.log('✅ Created "latest" symlink');
        } catch (error) {
            // Symlinks may fail on Windows - that's okay, restore will find latest by date
            console.log('ℹ️  Note: Symlink creation skipped (Windows requires Developer Mode)');
        }

        // 5. Clean up old snapshots
        console.log('🧹 Checking for old snapshots...');
        const allEntries = await fs.readdir(SNAPSHOT_DIR);
        const allSnapshots = allEntries
            .filter((entry) => entry.startsWith('snapshot_'))
            .sort()
            .reverse(); // Newest first

        if (allSnapshots.length > MAX_SNAPSHOTS) {
            const snapshotsToDelete = allSnapshots.slice(MAX_SNAPSHOTS);
            console.log(`🗑️  Deleting ${snapshotsToDelete.length} old snapshot(s)...`);

            for (const oldSnapshot of snapshotsToDelete) {
                const oldSnapshotPath = path.join(SNAPSHOT_DIR, oldSnapshot);
                await fs.remove(oldSnapshotPath);
                console.log(`   Deleted: ${oldSnapshot}`);
            }

            console.log(`✅ Kept ${MAX_SNAPSHOTS} most recent snapshots`);
        } else {
            console.log(`✅ ${allSnapshots.length} snapshot(s) stored (max: ${MAX_SNAPSHOTS})`);
        }

        console.log('');
        console.log(`✅ Snapshot complete: ${snapshotPath}`);
        console.log('');
        console.log(`To restore this snapshot, run: npm run restore ${snapshotName}`);
    } catch (error) {
        console.error('Error creating snapshot:', error);
        process.exit(1);
    }
}

createSnapshot();
