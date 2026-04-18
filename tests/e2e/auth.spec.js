import { test, expect } from '@playwright/test'

// End-to-end auth flow: sign up → browse → sign out → sign in → browse.
//
// Each run uses a unique email so sign-ups never collide. Supabase accepts
// any syntactically valid email at the signup endpoint.
//
// Prerequisite: email confirmation must be disabled in the Supabase project
// (Authentication → Providers → Email → "Confirm email" OFF). With it on,
// sign-up returns a "Check your email" screen instead of a session, and
// step 4 will (correctly) fail.

function uniqueEmail() {
  const stamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `playwright-${stamp}-${rand}@cleanshopper.test`
}

const PASSWORD = 'TestPassword123!'

test('sign-up, sign-out, and sign-in flow', async ({ page }) => {
  const email = uniqueEmail()

  // 1. Open the app — sign-in page is the default for signed-out users.
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  // 2. Navigate to sign-up via the "Create one" link.
  await page.getByRole('button', { name: 'Create one' }).click()
  await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()

  // 3. Create the account.
  //    InputField doesn't associate <label> → <input> via htmlFor/id, so we
  //    locate by placeholder text instead of role-based label lookup.
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Create account' }).click()

  // 4. Land on the Browse page.
  //    (Supabase auth is a real network call — give it a generous window.)
  await expect(page.getByRole('heading', { name: 'Browse' })).toBeVisible({ timeout: 20_000 })

  // 5. Sign out — the Sidebar shows a "Sign out" button on desktop viewports.
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  // 6. Sign in with the same credentials.
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // 7. Back on the Browse page.
  await expect(page.getByRole('heading', { name: 'Browse' })).toBeVisible({ timeout: 20_000 })
})
