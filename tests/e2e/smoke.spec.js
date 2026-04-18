import { test, expect } from '@playwright/test'

// The home page should load and render without runtime errors.
// Fails if: the page 404s, a script throws, or the console logs an error.
test('home page loads without errors', async ({ page }) => {
  const consoleErrors = []
  const pageErrors = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    pageErrors.push(err.message)
  })

  const response = await page.goto('/')
  expect(response?.ok(), 'home page should return a 2xx status').toBeTruthy()

  // Brand is visible — proves the React tree mounted.
  await expect(page.getByText('Clean Shopper').first()).toBeVisible()

  expect(pageErrors, 'no uncaught exceptions').toEqual([])
  expect(consoleErrors, 'no console errors').toEqual([])
})
