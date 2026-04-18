import { test, expect } from '@playwright/test'
import { signUpAndLogIn } from './helpers/auth.js'

// Signed-in user searches, saves a product, and verifies the saved state
// persists across a full page reload.
test('save-to-list persists across reload', async ({ page }) => {
  await signUpAndLogIn(page)

  async function runSoapSearch() {
    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible()

    const searchInput = page.getByPlaceholder(/shampoo.*dish soap.*Dove/i)
    await searchInput.fill('soap')
    // Scope to main — the sidebar also has a "Search" nav button.
    await page.getByRole('main').getByRole('button', { name: 'Search' }).click()

    await expect(page.getByText(/\d+ results? for "soap"/i)).toBeVisible({ timeout: 15_000 })
  }

  // First search — save the first result.
  await runSoapSearch()

  // ProductCard renders the Save button with text "Save to list". There's one
  // per card; click the first.
  const saveButton = page.getByRole('button', { name: 'Save to list' }).first()
  await expect(saveButton).toBeVisible()
  // The Save button triggers an optimistic UI flip AND a POST to the Supabase
  // `saved_products` table. Wait on both so the reload below doesn't race the
  // network round-trip.
  const savePost = page.waitForResponse(
    (res) => /\/rest\/v1\/saved_products/.test(res.url()) && res.request().method() === 'POST',
    { timeout: 10_000 }
  )
  await saveButton.click()

  // After save, at least one card should now show "Saved" instead of "Save to list".
  await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible({ timeout: 10_000 })

  // Wait for the Supabase insert to actually persist before reloading.
  const response = await savePost
  expect(response.ok(), 'saved_products insert should succeed').toBeTruthy()

  // Full page reload — saved state must come back from Supabase.
  await page.reload()

  // After reload we're back on the signed-in shell. Re-run the same search
  // so the same products come back into the grid.
  await runSoapSearch()

  // The previously-saved product should still render its button as "Saved".
  await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible({ timeout: 10_000 })
})
