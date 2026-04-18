import { expect } from '@playwright/test'
import fs from 'fs'
import { CREDENTIALS_FILE } from '../global-setup.js'

/**
 * Sign into the shared test account created by globalSetup.
 * Uses sign-in (not sign-up) so tests never hit Supabase's sign-up rate limit.
 * Returns the credentials in case the caller needs them (e.g. after sign-out).
 */
export async function signUpAndLogIn(page) {
  const { email, password } = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('heading', { name: 'Browse' })).toBeVisible({ timeout: 20_000 })

  return { email, password }
}
