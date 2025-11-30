import { defineConfig } from '@playwright/test';

const port = process.env.CI ? 3001 : 3000;
const isCI = !!process.env.CI;

export default defineConfig({
    testDir: 'tests',
    testIgnore: isCI ? ['tests/visual/**'] : [],
    timeout: 60_000,
    use: {
        baseURL: `http://localhost:${port}`,
        viewport: { width: 1200, height: 800 },
        trace: 'on-first-retry',
    },
    webServer: {
        command: process.env.CI ? `next start -p ${port}` : `next dev -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
