import { test, expect } from '@playwright/test'
import { signUpAndLogIn } from './helpers/auth.js'

// Signed-in user lands on Browse, sees a product grid, and filters by category.
test('browse grid loads products and filters by category', async ({ page }) => {
  await signUpAndLogIn(page)

  // signUpAndLogIn already asserts the Browse heading is visible.
  await expect(page.getByRole('heading', { name: 'Browse', level: 1 })).toBeVisible()

  // Wait for the grid to populate — ProductCard renders each name as an <h3>.
  const cardHeadings = page.getByRole('heading', { level: 3 })
  await expect(cardHeadings.first()).toBeVisible({ timeout: 15_000 })

  const initialCount = await cardHeadings.count()
  expect(initialCount, 'Browse should show at least one product by default').toBeGreaterThan(0)

  // Capture the names currently showing so we can detect the filter change.
  const initialNames = await cardHeadings.allTextContents()

  // Click the "Personal Care" category filter.
  // CategoryTag renders as <button> when it has an onClick handler.
  await page.getByRole('button', { name: 'Personal Care', exact: true }).click()

  // Wait for the grid to settle into a different set of products.
  // (The "All" filter includes Personal Care items plus others, so the list
  // should shrink or at least differ.)
  await expect
    .poll(async () => {
      const names = await cardHeadings.allTextContents()
      // Different from the initial "All" set — either fewer items or different order.
      return names.length > 0 && JSON.stringify(names) !== JSON.stringify(initialNames)
    }, {
      message: 'clicking Personal Care should update the product grid',
      timeout: 15_000,
    })
    .toBeTruthy()

  // Filtered view still shows at least one product.
  const filteredCount = await cardHeadings.count()
  expect(filteredCount, 'Personal Care should have at least one product').toBeGreaterThan(0)

  // Every visible card in the filtered view should carry the "Personal Care"
  // CategoryTag (rendered inside the card body as a non-interactive <span>).
  // There's one such tag per card.
  const personalCareTags = page.locator('span', { hasText: /^Personal Care$/ })
  const tagCount = await personalCareTags.count()
  expect(tagCount, 'each filtered card should be tagged Personal Care').toBeGreaterThanOrEqual(filteredCount)
})
