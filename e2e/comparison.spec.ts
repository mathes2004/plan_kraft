import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('.comparison').scrollIntoViewIfNeeded();
});

test('homepage shows the original before and after photos with a centered divider', async ({
  page,
}) => {
  const comparison = page.locator('.comparison');
  const slider = comparison.getByRole('slider');
  await expect(slider).toHaveValue('50');
  await expect(comparison.locator('.before-label')).toHaveText('BEFORE');
  await expect(comparison.locator('.after-label')).toHaveText('AFTER');
  for (const image of await comparison.locator('img').all()) {
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
  await expect(comparison.locator('.before-image img')).toHaveAttribute('src', /exterior-before/);
  await expect(comparison.locator(':scope > img')).toHaveAttribute('src', /exterior-after/);
  await expect(page.locator('.comparison-note')).toContainText('different angles');
  await expect(page.locator('.comparison-layout')).not.toContainText('photographs are available');
});

test('dragging right reveals more before and dragging left reveals more after', async ({
  page,
}) => {
  const comparison = page.locator('.comparison');
  const slider = comparison.getByRole('slider');
  const box = (await comparison.boundingBox())!;
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.85, y, { steps: 10 });
  await expect.poll(async () => Number(await slider.inputValue())).toBeCloseTo(85, 0);
  await expect(slider).toHaveAttribute('aria-valuetext', /85% before image and 15% after/);
  await expect
    .poll(() =>
      comparison.locator('.before-image').evaluate((el) => {
        const clippedRight = getComputedStyle(el).clipPath.match(/([\d.]+)%/);
        return Number(clippedRight?.[1]);
      }),
    )
    .toBeCloseTo(15, 0);
  await page.mouse.move(box.x + box.width * 0.15, y, { steps: 10 });
  await expect.poll(async () => Number(await slider.inputValue())).toBeCloseTo(15, 0);
  await expect(slider).toHaveAttribute('aria-valuetext', /15% before image and 85% after/);
  await page.mouse.move(box.x + box.width + 20, y);
  await expect(slider).toHaveValue('100');
  await page.mouse.move(box.x - 20, y);
  await expect(slider).toHaveValue('0');
  await page.mouse.up();
  await expect(comparison).toHaveAttribute('data-dragging', 'false');
});

test('keyboard comparison reaches both images and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const comparison = page.locator('.comparison');
  const slider = comparison.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
  await page.keyboard.press('ArrowLeft');
  await expect(slider).toHaveValue('99.9');
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');
  await expect(slider).toHaveAttribute(
    'aria-valuetext',
    '0% before image and 100% after image visible',
  );
  for (const selector of ['.before-image', '.comparison-handle']) {
    expect(
      await comparison.locator(selector).evaluate((el) => getComputedStyle(el).transitionDuration),
    ).toBe('0s');
  }
});

test('touch dragging moves the divider on mobile', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  const comparison = page.locator('.comparison');
  const box = (await comparison.boundingBox())!;
  const y = box.y + box.height / 2;
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: box.x + box.width / 2, y }],
    });
    for (let step = 1; step <= 10; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: box.x + box.width * (0.5 + step * 0.03), y }],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect
      .poll(async () => Number(await comparison.getByRole('slider').inputValue()))
      .toBeCloseTo(80, 0);
    await expect(comparison).toHaveAttribute('data-dragging', 'false');
  } finally {
    await session.detach();
  }
});
