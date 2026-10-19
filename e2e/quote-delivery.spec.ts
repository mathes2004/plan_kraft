import { test, expect, type Page } from '@playwright/test';

const endpoint = 'https://forminit.com/f/nilov0qnww9';
const accepted = {
  success: true,
  submission: { hashId: 'test-submission-01' },
  redirectUrl: 'https://forminit.com/thank-you',
};
test.beforeEach(async ({ page }) => {
  // Only per-test provider mocks may handle external requests.
  await page.route(
    (url) => url.protocol === 'https:',
    (route) => route.abort(),
  );
});
async function fillEnquiry(page: Page) {
  await page.locator('#name').fill('Test Customer');
  await page.locator('#phone').fill('077 123 4567');
  await page.locator('#location').selectOption('Batticaloa');
  await page.locator('#serviceId').selectOption('roof');
  await page.locator('#description').fill('Water is entering through the roof.');
}

test('invalid fields and honeypot values never reach the mail service', async ({ page }) => {
  let sent = 0;
  await page.route(endpoint, (route) => {
    sent++;
    return route.abort();
  });
  await page.goto('/request-quote');
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#phone')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#location')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('status')).toBeFocused();
  await fillEnquiry(page);
  await page.locator('#website').evaluate((input: HTMLInputElement) => {
    input.value = 'spam';
  });
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Please check');
  expect(sent).toBe(0);
});

test('Send delivers every field to the configured Forminit form and prevents concurrent requests', async ({
  page,
}) => {
  const payloads: Record<string, unknown>[] = [];
  let release!: () => void;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    expect(route.request().headers()['x-api-key']).toBeUndefined();
    expect(route.request().headers()['content-type']).toContain(
      'application/x-www-form-urlencoded',
    );
    payloads.push(Object.fromEntries(new URLSearchParams(route.request().postData() || '')));
    await ready;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(accepted),
    });
  });
  await page.goto('/request-quote');
  await expect(page.locator('form')).toHaveAttribute('action', endpoint);
  await fillEnquiry(page);
  const button = page.getByRole('button', { name: 'Send Enquiry' });
  await button.click();
  await expect.poll(() => payloads.length).toBe(1);
  await expect(page.getByRole('button', { name: /Sending enquiry/ })).toBeDisabled();
  await page
    .locator('form')
    .evaluate((form) =>
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
  expect(payloads).toHaveLength(1);
  expect(payloads[0]).toMatchObject({
    'fi-sender-fullName': 'Test Customer',
    'fi-sender-phone': '+94771234567',
    'fi-text-location': 'Batticaloa',
    'fi-text-service': 'Roof / Rooftop Waterproofing',
    'fi-text-message': 'Water is entering through the roof.',
    _gotcha: '',
    'fi-url-source': 'http://localhost:3000/request-quote',
  });
  expect(payloads[0]).toHaveProperty('fi-text-reference');
  expect(payloads[0]).not.toHaveProperty('recipient');
  expect(payloads[0]).not.toHaveProperty('fi-sender-email');
  release();
  await expect(page.getByRole('status')).toContainText('accepted');
  await expect(page.getByRole('status')).toBeFocused();
  await expect(page.locator('#name')).toHaveValue('');
  await expect(page).toHaveURL(/\/request-quote$/);
});

test('HTTP errors, provider rejection and malformed responses preserve entered details', async ({
  page,
}) => {
  await page.goto('/request-quote');
  await fillEnquiry(page);
  for (const response of [
    { status: 503, contentType: 'application/json', body: JSON.stringify(accepted) },
    { status: 200, contentType: 'application/json', body: JSON.stringify({ success: false }) },
    { status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) },
    { status: 200, contentType: 'text/html', body: '<html>Service unavailable</html>' },
  ]) {
    await page.route(endpoint, (route) => route.fulfill(response));
    await page.getByRole('button', { name: 'Send Enquiry' }).click();
    await expect(page.getByRole('status')).toContainText('could not confirm');
    await expect(page.locator('#name')).toHaveValue('Test Customer');
    await expect(page.locator('#description')).toHaveValue('Water is entering through the roof.');
    await expect(page.getByRole('button', { name: 'Send Enquiry' })).toBeEnabled();
    await page.unroute(endpoint);
  }
});

test('Forminit rate limits are reported without clearing the enquiry', async ({ page }) => {
  await page.route(endpoint, (route) =>
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'TOO_MANY_REQUESTS',
        code: 429,
      }),
    }),
  );
  await page.goto('/request-quote');
  await fillEnquiry(page);
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('wait at least five seconds');
  await expect(page.locator('#name')).toHaveValue('Test Customer');
  await expect(page.locator('.form-message')).not.toHaveClass(/success/);
});

test('network errors keep the enquiry available for a successful retry', async ({ page }) => {
  await page.route(endpoint, (route) => route.abort('failed'));
  await page.goto('/request-quote');
  await fillEnquiry(page);
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('could not confirm');
  await expect(page.locator('#name')).toHaveValue('Test Customer');
  await page.unroute(endpoint);
  await page.route(endpoint, (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(accepted) }),
  );
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('accepted');
  await expect(page.locator('#name')).toHaveValue('');
});
