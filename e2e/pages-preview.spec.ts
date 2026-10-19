import { test, expect } from '@playwright/test';

test('all seven exported routes load beneath the repository path', async ({ page }) => {
  test.setTimeout(60000);
  const broken: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400)
      broken.push(response.url());
  });
  for (const route of [
    '',
    'services/',
    'about/',
    'projects/',
    'work-process/',
    'contact/',
    'request-quote/',
  ]) {
    const response = await page.goto(route || './', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`https://mathes2004.github.io/plan_kraft/${route.replace(/\/$/, '')}`),
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  }
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('client navigation, gallery photos and reloads work without a server', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('iframe.hero-animation')).toHaveAttribute(
    'src',
    '/plan_kraft/banner/index.html',
  );
  const banner = page.frameLocator('iframe.hero-animation');
  await expect(banner.locator('canvas[data-engine="three.js r169"]')).toBeVisible();
  await page.locator('main').getByRole('link', { name: 'Explore Our Projects' }).click();
  await expect(page).toHaveURL(/\/plan_kraft\/projects\/$/);
  await expect(page.locator('.project-card')).toHaveCount(12);
  await page.reload();
  await expect(page.locator('.project-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Open Epoxy grout restoration gallery' }).click();
  const gallery = page.getByRole('dialog');
  await expect(gallery).toBeVisible();
  await expect(gallery.locator('.lightbox-image img')).toHaveAttribute(
    'src',
    /^\/plan_kraft\/_next\/static\/media\//,
  );
  await expect
    .poll(() =>
      gallery
        .locator('.lightbox-image img')
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
    )
    .toBe(true);
  await gallery.getByRole('button', { name: 'Next photo' }).click();
  await expect(gallery.locator('.lightbox-controls')).toContainText('1 / 3');
  await page.keyboard.press('Escape');
  await expect(gallery).not.toBeVisible();
});

test('static quote form sends through the free service without a local API', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/quote')) requests.push(request.url());
  });
  await page.goto('request-quote/?service=roof&project=Rooftop%20waterproofing');
  await page.route('https://forminit.com/f/nilov0qnww9', (route) => {
    expect(
      new URLSearchParams(route.request().postData() || '').get('fi-text-projectDistrict'),
    ).toBe('Batticaloa');
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ success: true, submission: { hashId: 'preview-submission-01' } }),
    });
  });
  await expect(page.locator('#serviceId')).toHaveValue('roof');
  await expect(page.locator('#description')).toContainText('Rooftop waterproofing');
  await expect(page.getByRole('button', { name: 'Send Enquiry' })).toBeEnabled();
  await page.locator('#name').fill('Preview Customer');
  await page.locator('#phone').fill('0771234567');
  await expect(page.getByRole('combobox', { name: 'District / project location' })).toHaveValue('');
  await expect(page.locator('#location option')).toHaveCount(26);
  await page.locator('#location').selectOption('Batticaloa');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('accepted');
  await expect(page.locator('#location')).toHaveValue('');
  expect(requests).toEqual([]);
  await expect(
    page.locator('.quote-form').getByRole('link', { name: 'choose to chat on WhatsApp' }),
  ).toHaveAttribute('href', /^https:\/\/wa.me\//);
});

test('exports include the sitemap, robots and a working not-found page', async ({
  page,
  request,
}) => {
  const sitemap = await request.get('sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)).toHaveLength(7);
  expect(xml).toContain('https://mathes2004.github.io/plan_kraft/services');
  expect(await (await request.get('robots.txt')).text()).toContain('Disallow: /');
  expect((await request.get('api/quote')).status()).toBe(404);
  const missing = await page.goto('unknown-page/');
  expect(missing?.status()).toBe(404);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL(/\/plan_kraft\/$/);
});
