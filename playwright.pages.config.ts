import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'pages-preview.spec.ts',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4173/plan_kraft/', trace: 'retain-on-failure' },
  outputDir: 'test-results/pages',
  projects: [
    { name: 'pages-desktop', use: { ...devices['Desktop Chrome'], channel: 'msedge' } },
    {
      name: 'pages-mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'node scripts/serve-pages.mjs',
    url: 'http://127.0.0.1:4173/plan_kraft/',
    reuseExistingServer: !process.env.CI,
  },
});
