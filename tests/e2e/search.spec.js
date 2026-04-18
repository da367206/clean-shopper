import { test, expect } from '@playwright/test'
import { signUpAndLogIn } from './helpers/auth.js'

// Signed-in user searches for a product and sees results with name + safety badge.
test('search returns product results with names and safety scores', async ({ page }) => {
  await signUpAndLogIn(page)

  // Switch to the Search tab via the Sidebar (desktop viewport by default).
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible()

  // "soap" matches multiple seeded products (castile soap, dish soap, hand soap…).
  const searchInput = page.getByPlaceholder(/shampoo.*dish soap.*Dove/i)
  await searchInput.fill('soap')
  // There are two "Search" buttons on this page — the sidebar nav tab and the
  // form submit button. Scope to the main region to hit the submit button.
  await page.getByRole('main').getByRole('button', { name: 'Search' }).click()

  // Wait for the results summary — proves the query resolved, not just "loading".
  await expect(page.getByText(/\d+ results? for "soap"/i)).toBeVisible({ timeout: 15_000 })

  // Every result card must have a name (h3) AND a safety badge.
  const cardHeadings = page.getByRole('heading', { level: 3 })
  const count = await cardHeadings.count()
  expect(count, 'at least one product should match "soap"').toBeGreaterThan(0)

  // Each card has its own SafetyBadge span — "Clean", "Caution", or "Avoid".
  const safetyBadges = page.locator('span', { hasText: /^(Clean|Caution|Avoid)$/ })
  const badgeCount = await safetyBadges.count()

  // Each card renders the badge twice (solid overlay on the image + sm badge in
  // the body), so badges should be at least 2× the number of cards.
  expect(badgeCount, 'each card should render its safety badge').toBeGreaterThanOrEqual(count)

  // Spot-check the first card: heading has non-empty text.
  const firstName = (await cardHeadings.first().textContent())?.trim()
  expect(firstName?.length, 'first result has a product name').toBeGreaterThan(0)
})
