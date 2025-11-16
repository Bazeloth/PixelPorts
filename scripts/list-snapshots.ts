import fs from 'fs-extra';
import path from 'path';

const SNAPSHOT_DIR = './supabase/snapshots';

async function getLatestSnapshot(): Promise<string | null> {
    const latestPath = path.join(SNAPSHOT_DIR, 'latest');
    try {
        const stats = await fs.lstat(latestPath);
        if (stats.isSymbolicLink()) {
            return await fs.readlink(latestPath);
        }
    } catch (error) {
        // Symlink doesn't exist (common on Windows)
    }

    // Fallback: return the most recent snapshot by sorting
    try {
        const entries = await fs.readdir(SNAPSHOT_DIR);
        const snapshots = entries
            .filter((entry) => entry.startsWith('snapshot_'))
            .sort()
            .reverse();
        return snapshots[0] || null;
    } catch (error) {
        return null;
    }
}

async function listSnapshots() {
    console.log('📸 Available Supabase snapshots:');
    console.log('');

    const dirExists = await fs.pathExists(SNAPSHOT_DIR);

    if (!dirExists) {
        console.log("  (none - snapshots directory doesn't exist yet)");
        console.log('');
        console.log('Create your first snapshot with: npm run snapshot');
        return;
    }

    // Find all snapshot directories
    const entries = await fs.readdir(SNAPSHOT_DIR);
    const snapshots = entries
        .filter((entry) => entry.startsWith('snapshot_'))
        .sort()
        .reverse();

    if (snapshots.length === 0) {
        console.log('  (none)');
        console.log('');
        console.log('Create your first snapshot with: npm run snapshot');
        return;
    }

    const latestSnapshot = await getLatestSnapshot();

    for (const snapshotName of snapshots) {
        const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);

        // Check if this is the latest
        const isLatest = snapshotName === latestSnapshot;
        const latestTag = isLatest ? ' (latest)' : '';

        // Get metadata if available
        const metadataPath = path.join(snapshotPath, 'metadata.json');
        const hasMetadata = await fs.pathExists(metadataPath);

        console.log(`  • ${snapshotName}${latestTag}`);

        if (hasMetadata) {
            const metadata = await fs.readJSON(metadataPath);
            if (metadata.date) {
                console.log(`    Created: ${metadata.date}`);
            }
        }

        // Check what's in the snapshot
        const hasDb = await fs.pathExists(path.join(snapshotPath, 'database.sql'));
        const hasStorage = await fs.pathExists(path.join(snapshotPath, 'storage'));

        const contents: string[] = [];
        if (hasDb) contents.push('DB');
        if (hasStorage) contents.push('Storage');

        if (contents.length > 0) {
            console.log(`    Contains: ${contents.join(', ')}`);
        }

        console.log('');
    }

    console.log('To restore a snapshot, run: npm run restore <snapshot_name>');
    console.log('To restore the latest, run: npm run restore');
}

listSnapshots();
