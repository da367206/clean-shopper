// One-off Playwright config for running the existing e2e suite against the
// live Vercel deployment instead of the local dev server.
//
// Usage:
//   npx playwright test --config=playwright.prod.config.js --project=chromium
//
// Differences from playwright.config.js:
//   - baseURL points at the Vercel production URL
//   - no webServer (we're not starting a local dev server)
//   - longer action timeouts (prod is further away than localhost)
import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.PROD_BASE_URL || 'https://clean-shopper-peach.vercel.app'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 1,
  reporter: 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Prod is on the network, not localhost — give network-bound clicks more room.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
