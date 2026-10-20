import { test, expect } from '@playwright/test';

test('bathroom homepage preview uses the complete Services image', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Next services' })).toBeEnabled();
  const card = page.locator('.preview-card[data-service="bathroom"]');
  await card.focus();
  const photo = card.locator('img');
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute('src', /bathroom-waterproofing-stages\./);
  await expect
    .poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth === 1536))
    .toBe(true);
  const source = await photo.getAttribute('src');
  const size = await photo.evaluate((el) => {
    const image = el.getBoundingClientRect();
    const box = el.closest('.service-graphic')!.getBoundingClientRect();
    return {
      ratio: image.width / image.height,
      widthGap: Math.abs(image.width - box.width),
      heightGap: Math.abs(image.height - box.height),
    };
  });
  expect(size.ratio).toBeCloseTo(1.5, 2);
  expect(size.widthGap).toBeLessThan(1);
  expect(size.heightGap).toBeLessThan(1);
  await card.click();
  await expect(page).toHaveURL(/services\/#bathroom$/);
  await expect(page.locator('#bathroom img')).toHaveAttribute('src', source!);
});

test('six homepage services scroll with arrows and keyboard and link to their details', async ({
  page,
}) => {
  await page.goto('./');
  const carousel = page.getByRole('region', { name: 'Featured services' });
  const track = carousel.locator('.service-preview');
  const cards = track.locator('.preview-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.first().locator('h3')).toHaveText('Rooftop Waterproofing↗');
  for (const [i, id] of [
    'roof',
    'epoxy-grouting',
    'fiber-paint-application',
    'polyurethane-coating-application',
    'bathroom',
    'terrace',
  ].entries()) {
    await expect(cards.nth(i)).toHaveAttribute('href', `/plan_kraft/services/#${id}`);
  }
  const previous = carousel.getByRole('button', { name: 'Previous services' });
  const next = carousel.getByRole('button', { name: 'Next services' });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  await expect(previous).toBeEnabled();
  await track.focus();
  await page.keyboard.press('End');
  await expect(next).toBeDisabled();
  await page.keyboard.press('Home');
  await expect(previous).toBeDisabled();
  await page.keyboard.press('ArrowRight');
  await expect(previous).toBeEnabled();
  await page.keyboard.press('End');
  await expect(next).toBeDisabled();
  await cards.last().click();
  await expect(page).toHaveURL(/services\/#terrace$/);
  await expect(page.locator('#terrace h2')).toHaveText('Terrace / Balcony Waterproofing');
});

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
  await page.route('https://forminit.com/**', (route) => route.abort());
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/quote')) requests.push(request.url());
  });
  await page.goto('request-quote/?service=roof&project=Rooftop%20waterproofing');
  await expect(page.locator('form')).toHaveAttribute(
    'action',
    'https://forminit.com/f/wi49nocyvbs',
  );
  await page.route('https://forminit.com/f/wi49nocyvbs', (route) => {
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
