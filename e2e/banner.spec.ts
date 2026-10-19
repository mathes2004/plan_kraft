import { test, expect } from '@playwright/test';

test('banner renders the 3D house and supports its comparison and rain controls', async ({
  page,
}) => {
  await page.goto('/');
  const banner = page.frameLocator('.hero-animation');
  await expect(banner.locator('canvas[data-engine="three.js r169"]')).toBeVisible();
  await expect(banner.locator('#scene-fallback')).toBeHidden();

  await banner.getByRole('button', { name: 'Before', exact: true }).click();
  await expect(banner.locator('#protection-label')).toHaveText('Unprotected roof');
  await expect(banner.locator('#demo-caption')).toContainText('Water reaches the inside');
  await banner.getByRole('button', { name: 'With Plan Kraft', exact: true }).click();
  await expect(banner.locator('#protection-label')).toHaveText('Protected by Plan Kraft');

  await banner.getByRole('button', { name: 'Explore layers', exact: true }).click();
  await expect(banner.getByRole('button', { name: 'Close layers' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await banner.getByRole('button', { name: 'Close layers' }).click();
  await banner.getByRole('button', { name: 'Pause rain', exact: true }).click();
  await expect(banner.getByRole('button', { name: 'Resume rain' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await banner.getByRole('button', { name: 'Resume rain' }).click();
  await expect(banner.getByRole('button', { name: 'Pause rain' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await banner.getByRole('slider', { name: 'Rainfall intensity' }).fill('25');
  await expect(banner.getByRole('slider', { name: 'Rainfall intensity' })).toHaveValue('25');
  expect(
    await banner.locator('body').evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
});

test('banner starts with motion paused for reduced-motion visitors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const banner = page.frameLocator('.hero-animation');
  await expect(banner.locator('canvas')).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Resume rain' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await banner.getByRole('button', { name: 'Before', exact: true }).click();
  await expect(banner.locator('#protection-label')).toHaveText('Unprotected roof');
});

test('banner retains a usable illustration when the 3D dependency cannot load', async ({
  page,
}) => {
  await page.route('**/banner/assets/three.module.min.js', (route) => route.abort());
  await page.goto('/');
  const banner = page.frameLocator('.hero-animation');
  await expect(banner.locator('.scene-help')).toHaveText('Roof protection illustration');
  await expect(banner.locator('#scene-fallback')).toBeVisible();
  await expect(banner.getByRole('slider', { name: 'Rainfall intensity' })).toBeDisabled();
  await expect(banner.locator('#layers-button')).toBeHidden();
  await banner.getByRole('button', { name: 'Before', exact: true }).click();
  await expect(banner.locator('#protection-label')).toHaveText('Unprotected roof');
  await expect(banner.locator('.fallback-cracks')).toBeVisible();
  await banner.getByRole('button', { name: 'With Plan Kraft', exact: true }).click();
  await expect(banner.locator('.fallback-cracks')).toBeHidden();
});
