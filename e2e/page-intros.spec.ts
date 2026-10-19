import { test, expect } from '@playwright/test';

const pages = [
  { route: '/services', target: 'our-services' },
  { route: '/about', target: 'about-plan-kraft' },
  { route: '/projects', target: 'completed-projects' },
  { route: '/work-process', target: 'our-process' },
  { route: '/contact', target: 'contact-details' },
];

for (const { route, target } of pages) {
  test(`${route} reveals the next section and offers keyboard scrolling`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const sizes =
      info.project.name === 'mobile'
        ? [
            [390, 844],
            [375, 667],
            [320, 568],
          ]
        : [
            [1366, 768],
            [1024, 600],
            [768, 1024],
          ];

    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const cue = page.getByRole('link', { name: /^Scroll / });
      await expect(cue).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const cueBox = await cue.boundingBox();
      const contentBox = await page.locator(`#${target} > .container`).boundingBox();
      expect(cueBox).not.toBeNull();
      expect(contentBox).not.toBeNull();
      expect(cueBox!.y + cueBox!.height, `scroll cue fits ${width}×${height}`).toBeLessThan(height);
      expect(contentBox!.y, `next content visible on ${route} at ${width}×${height}`).toBeLessThan(
        height - 64,
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }

    const cue = page.getByRole('link', { name: /^Scroll / });
    await expect(cue).toHaveAttribute('href', `#${target}`);
    await cue.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${target}$`));
    await expect(page.locator(`#${target}`)).toBeFocused();
    await expect
      .poll(async () => (await page.locator(`#${target}`).boundingBox())!.y)
      .toBeLessThanOrEqual(112);
    expect((await page.locator(`#${target}`).boundingBox())!.y).toBeGreaterThanOrEqual(0);
  });
}
