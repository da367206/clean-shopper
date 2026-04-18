import { expect } from '@playwright/test'

const PASSWORD = 'TestPassword123!'

function uniqueEmail() {
  const stamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `playwright-${stamp}-${rand}@cleanshopper.test`
}

/**
 * Open the app, create a new user, and wait until the signed-in Browse page
 * is visible. Returns the credentials used, in case the caller wants to sign
 * back in after a reload or sign-out.
 *
 * Assumes email confirmation is disabled in the Supabase project.
 */
export async function signUpAndLogIn(page) {
  const email = uniqueEmail()

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  await page.getByRole('button', { name: 'Create one' }).click()
  await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()

  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page.getByRole('heading', { name: 'Browse' })).toBeVisible({ timeout: 20_000 })

  return { email, password: PASSWORD }
}
