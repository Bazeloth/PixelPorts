import { test, expect } from '@playwright/test';

// Visual and basic interaction checks for the dev-only components gallery

test.describe('Dev Components Gallery', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dev/components');
        await page.waitForLoadState('networkidle');
    });

    test('page snapshot - desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 900 });
        await expect(page).toHaveScreenshot('dev-components-desktop.png', {
            animations: 'disabled',
            fullPage: true,
            maxDiffPixelRatio: 0.01,
        });
    });

    test('ShotFilters toggles active state', async ({ page }) => {
        // Scope to the ShotFilters section to avoid strict mode (multiple components on the page)
        const section = page.getByRole('heading', { name: 'ShotFilters' }).locator('..');
        const firstTablist = section.getByRole('tablist').first();
        const uiux = firstTablist.getByRole('tab', { name: 'UI/UX' });

        await uiux.click();
        await expect(uiux).toHaveAttribute('aria-selected', 'true');

        // Take a focused component screenshot after interaction
        await expect(section).toHaveScreenshot('filters-after-click.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
        });
    });
});
