import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  reporter: [['list'], ['json', { outputFile: 'test-results/report.json' }]],
  testDir: './e2e',
  testIgnore: 'pages-preview.spec.ts',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'msedge' } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'node node_modules/next/dist/bin/next start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
