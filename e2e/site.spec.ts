import { test, expect } from '@playwright/test';
const routes = [
  '/',
  '/services',
  '/about',
  '/projects',
  '/work-process',
  '/contact',
  '/request-quote',
];
for (const path of routes)
  test(`direct route ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
test('home has the required sections and no process model', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main>section')).toHaveCount(7);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('.process-scene')).toHaveCount(0);
  await expect(page.locator('.service-preview .preview-body h3')).toHaveText([
    'Rooftop Waterproofing↗',
    'Epoxy Grouting↗',
    'Fiber Paint Application↗',
    'Polyurethane Coating Application↗',
    'Bathroom waterproofing↗',
    'Terraces & balconies↗',
  ]);
});
test('all sixteen services have quote links', async ({ page }) => {
  await page.goto('/services');
  await expect(page.locator('.service-detail')).toHaveCount(16);
  await expect(page.locator('#external-wall .eyebrow')).toHaveText('10 / WATERPROOFING & REPAIR');
  await expect(page.locator('#roof-waterproofing .eyebrow')).toHaveText(
    '16 / WATERPROOFING & REPAIR',
  );
  await page
    .locator('#roof-waterproofing')
    .getByRole('link', { name: 'Discuss This Service' })
    .click();
  await expect(page.locator('#serviceId')).toHaveValue('roof-waterproofing');
});
test('process has no autoplay and obeys its controls', async ({ page }) => {
  await page.goto('/work-process');
  await expect(page.getByRole('heading', { name: 'Site Inspection', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '← Previous' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(
    page.getByRole('heading', { name: 'Problem Assessment', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: /08 Completion/ }).click();
  await expect(page.getByRole('button', { name: 'Next →' })).toBeDisabled();
  await page.getByRole('button', { name: 'Replay ↺' }).click();
  await expect(page.getByRole('button', { name: /Play/ })).toBeEnabled();
});
test('quote validation and honest delivery failure feedback', async ({ page }) => {
  await page.goto('/request-quote');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#name').fill('Test Customer');
  await page.locator('#phone').fill('0771234567');
  await page.locator('#location').selectOption('Batticaloa');
  await page.locator('#serviceId').selectOption('roof');
  await page.locator('#description').fill('Water is leaking through the roof.');
  await page.route('https://forminit.com/f/nilov0qnww9', (r) =>
    r.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Service temporarily unavailable.' }),
    }),
  );
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('could not confirm');
  await expect(page.locator('#name')).toHaveValue('Test Customer');
});
test('mobile menu supports Escape and restores focus', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('responsive matrix and preview screenshots', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  test.setTimeout(120000);
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
      if ((width === 390 || width === 1440) && (route === '/' || route === '/work-process'))
        await page.screenshot({
          path: `test-results/previews/${route === '/' ? 'home' : 'process'}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
    }
  }
});
test('process respects reduced motion and pauses when hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work-process');
  expect(
    await page.locator('.inspection-ring').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.clock.install();
  await page.getByRole('button', { name: /Play/ }).click();
  await page.clock.runFor(5100);
  await expect(
    page.getByRole('heading', { name: 'Problem Assessment', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.process-scene')).toHaveAttribute('data-hidden', 'true');
  await page.clock.runFor(10000);
  await expect(
    page.getByRole('heading', { name: 'Problem Assessment', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.getByRole('button', { name: /Pause/ }).click();
  await page.clock.runFor(10000);
  await expect(
    page.getByRole('heading', { name: 'Problem Assessment', exact: true }),
  ).toBeVisible();
});
test('gallery filters completed work and contact targets remain correct', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.project-image')).toHaveCount(12);
  await page.getByRole('button', { name: /^Bathroom Waterproofing/ }).click();
  await expect(page.getByRole('button', { name: /^Bathroom Waterproofing/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.project-image')).toHaveCount(3);
  await expect(page.locator('.project-card .project-title')).toHaveText([
    'Bathroom waterproofing',
    'Rooftop & bathroom waterproofing',
    'Bathroom waterproofing in Ampara',
  ]);
  await expect(page.locator('footer a[href="tel:+94740388334"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="tel:+94755183966"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="https://wa.me/94755183966"]')).toHaveCount(1);
});
test('SEO files and unknown route handling', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  expect((await response.text()).match(/<loc>/g)).toHaveLength(7);
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  expect((await request.get('/unknown-page')).status()).toBe(404);
});
