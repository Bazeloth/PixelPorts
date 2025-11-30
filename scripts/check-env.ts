// More explicit CLI output: validate server and client envs separately

async function check() {
    // 1) Server envs (also loads .env cascade locally via env/server)
    try {
        await import('../env/server');
        console.log('✅ Server environment variables OK');
    } catch (e: any) {
        const msg = e?.message || String(e);
        console.error('❌ Server env invalid:\n' + msg);
        process.exit(1);
    }

    // 2) Client envs (NEXT_PUBLIC_*)
    try {
        await import('../env/client');
        console.log('✅ Client environment variables OK');
    } catch (e: any) {
        const msg = e?.message || String(e);
        console.error('❌ Client env invalid:\n' + msg);
        process.exit(1);
    }
}

check();
