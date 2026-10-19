import { test, expect, type Page } from '@playwright/test';

const endpoint = 'https://formsubmit.co/ajax/mathesmathes20005@gmail.com';
async function fillEnquiry(page: Page) {
  await page.locator('#name').fill('Test Customer');
  await page.locator('#phone').fill('077 123 4567');
  await page.locator('#location').fill('Batticaloa');
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
  await expect(page.getByRole('status')).toBeFocused();
  await fillEnquiry(page);
  await page.locator('#website').evaluate((input: HTMLInputElement) => {
    input.value = 'spam';
  });
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Please check');
  expect(sent).toBe(0);
});

test('Send delivers every field to the fixed recipient and prevents concurrent requests', async ({
  page,
}) => {
  const payloads: Record<string, unknown>[] = [];
  let release!: () => void;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    payloads.push(route.request().postDataJSON());
    await ready;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ success: 'true' }),
    });
  });
  await page.goto('/request-quote');
  await expect(page.locator('form')).toHaveAttribute(
    'action',
    'https://formsubmit.co/mathesmathes20005@gmail.com',
  );
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
    name: 'Test Customer',
    phone: '+94771234567',
    location: 'Batticaloa',
    service: 'Roof / Rooftop Waterproofing',
    message: 'Water is entering through the roof.',
    _template: 'table',
    _honey: '',
    _url: 'http://localhost:3000/request-quote',
  });
  expect(payloads[0]).toHaveProperty('reference');
  expect(payloads[0]).not.toHaveProperty('_captcha');
  expect(payloads[0]).not.toHaveProperty('_cc');
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
    { status: 503, contentType: 'application/json', body: JSON.stringify({ success: 'true' }) },
    { status: 200, contentType: 'application/json', body: JSON.stringify({ success: 'false' }) },
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

test('pending recipient activation is reported without pretending delivery succeeded', async ({
  page,
}) => {
  await page.route(endpoint, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        success: 'true',
        message: 'Please activate this form using the confirmation email.',
      }),
    }),
  );
  await page.goto('/request-quote');
  await fillEnquiry(page);
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('awaiting email activation');
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
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true }) }),
  );
  await page.getByRole('button', { name: 'Send Enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('accepted');
  await expect(page.locator('#name')).toHaveValue('');
});
