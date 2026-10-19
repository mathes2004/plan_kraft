import { test, expect } from '@playwright/test';

test('projects show the supplied details and category filters', async ({ page }) => {
  await page.goto('projects/');
  await expect(page.locator('.project-card')).toHaveCount(12);
  await expect(page.locator('.project-contact-sheet button')).toHaveCount(32);
  await expect(page.locator('.portfolio-intro-foot')).not.toContainText(
    /completed projects|site photographs/,
  );
  await page.getByRole('button', { name: /^Rooftop Waterproofing/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('.project-card').first()).toContainText('2,300 sq ft');
  await expect(page.locator('.project-card').first()).toContainText('4 days');
  await expect(page.locator('.project-card').filter({ hasText: 'PROJECT / 314' })).toContainText(
    'Ampara',
  );
  await page.getByRole('button', { name: /^Bathroom Waterproofing/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('.project-card').filter({ hasText: 'PROJECT / 314' })).toContainText(
    'Rooftop & bathroom waterproofing',
  );
  await page.getByRole('button', { name: /^Water Tank Waterproofing/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('.project-card').first()).toContainText('150 mm waterbar');
  await expect(page.locator('.project-card').last()).toContainText('FINEX PLATINUM FLEX 2K');
  await expect(page.locator('.project-grid')).not.toContainText(/\b(?:roof|rooftop) coating\b/i);
  await page.getByRole('button', { name: /^Epoxy Grout Restoration/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText('PROJECT / 318');
  await page.getByRole('button', { name: /^External Wall Waterproofing/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(2);
  const wall331 = page.locator('.project-card').filter({ hasText: 'PROJECT / 331' });
  await expect(wall331).toContainText('3,360 sq ft');
  await expect(wall331).toContainText('15 days');
  await expect(wall331).toContainText('5 years');
  await expect(page.locator('.project-card').last()).toContainText('Trincomalee');
  await page.getByRole('button', { name: /^Lift Well Waterproofing/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText('IKOTE CM 30X');
  await expect(page.locator('.project-card')).not.toContainText(/rooftop/i);
  await page.getByRole('button', { name: /^All projects/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(12);
});

test('all thirty-two original photos load locally in the accessible gallery', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('projects/');
  const covers = page.locator('.project-image');
  const photoCounts = [3, 3, 3, 3, 2, 3, 3, 2, 3, 2, 3, 2];
  const coverIndices = [2, 2, 2, 2, 1, 2, 2, 1, 0, 0, 1, 0];
  for (let project = 0; project < photoCounts.length; project++) {
    const count = photoCounts[project];
    const cover = covers.nth(project);
    await cover.click();
    const gallery = page.getByRole('dialog');
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole('button', { name: 'Close gallery' })).toBeFocused();
    await expect(gallery.locator('.lightbox-controls')).toContainText(
      `${coverIndices[project] + 1} / ${count}`,
    );
    await expect(gallery).not.toContainText(
      /Client:|Location:|\broad\b|075 518 3966|074 038 8334/i,
    );
    for (let photo = 0; photo < count; photo++) {
      const thumb = gallery.locator('.lightbox-thumbnails button').nth(photo);
      await thumb.click();
      await expect(thumb).toHaveAttribute('aria-pressed', 'true');
      await expect(gallery.locator('.lightbox-controls')).toContainText(`${photo + 1} / ${count}`);
      const image = gallery.locator('.lightbox-image img');
      await expect(image).toHaveAttribute('alt', /\w+/);
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      const source = await image.getAttribute('src');
      expect(decodeURIComponent(source || '')).toContain('/_next/static/media/');
    }
    await page.keyboard.press('ArrowRight');
    await expect(gallery.locator('.lightbox-controls')).toContainText(`1 / ${count}`);
    await page.keyboard.press('ArrowLeft');
    await expect(gallery.locator('.lightbox-controls')).toContainText(`${count} / ${count}`);
    await page.keyboard.press('Escape');
    await expect(gallery).not.toBeVisible();
    await expect(cover).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  }
});

test('epoxy restoration omits unstated facts and keeps enquiry context', async ({ page }) => {
  await page.goto('projects/');
  await page.getByRole('button', { name: /^Epoxy Grout Restoration/ }).click();
  await expect(page.locator('.project-facts')).toHaveCount(0);
  await expect(page.locator('.project-warranty-note')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open Epoxy grout restoration gallery' }).click();
  const gallery = page.getByRole('dialog');
  await expect(gallery).not.toContainText(/Duration|Warranty|roof coating|undefined/i);
  await expect(gallery).toContainText('Deep cleaning of the tile joints');
  await gallery.getByRole('link', { name: 'Plan a similar project' }).click();
  await expect(page.locator('#serviceId')).toHaveValue('terrace');
  await expect(page.locator('#description')).toHaveValue(
    'Enquiry about work similar to: Epoxy grout restoration',
  );
});

test('stage thumbnails open the selected photo and project enquiries keep context', async ({
  page,
}) => {
  await page.goto('projects/');
  await page
    .getByRole('button', { name: 'View Rooftop waterproofing: Surface preparation', exact: true })
    .click();
  const gallery = page.getByRole('dialog');
  await expect(gallery.locator('.lightbox-controls')).toContainText('1 / 3');
  await gallery.getByRole('button', { name: 'Next photo' }).click();
  await expect(gallery.locator('.lightbox-controls')).toContainText('2 / 3');
  await gallery.getByRole('link', { name: 'Plan a similar project' }).click();
  await expect(page.locator('#serviceId')).toHaveValue('roof');
  await expect(page.locator('#description')).toHaveValue(
    'Enquiry about work similar to: Rooftop waterproofing',
  );
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('project descriptions omit client and address fields', async ({ page }) => {
  await page.goto('projects/');
  const projects = page.locator('#completed-projects');
  await expect(projects).not.toContainText(/Client:|Location:|\broad\b|075 518 3966|074 038 8334/i);
  await expect(projects).toContainText('Batticaloa');
  await page.getByRole('button', { name: 'Open Sump tank waterbar installation gallery' }).click();
  await expect(page.getByRole('dialog')).not.toContainText(/Client:|Location:|\broad\b/i);
  await expect(page.getByRole('dialog')).toContainText('Construction joint');
});

test('homepage features all three real projects', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.project-grid-featured .project-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Open Bathroom waterproofing gallery' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Bathroom waterproofing', exact: true }),
  ).toBeVisible();
});
