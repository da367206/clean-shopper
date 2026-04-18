/**
 * Playwright globalSetup — runs once before the entire test suite.
 *
 * Creates a single shared Supabase test account and writes the credentials
 * to a temp file so all tests can sign IN (not sign up) via the auth helper.
 * This avoids hitting Supabase's per-hour sign-up rate limit when many
 * parallel tests each try to create their own account.
 */
import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const PORT = 5173
const BASE_URL = `http://localhost:${PORT}`

export const CREDENTIALS_FILE = path.join(
  process.cwd(),
  'test-results/.test-credentials.json'
)

const PASSWORD = 'TestPassword123!'

export default async function globalSetup() {
  const stamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  const email = `playwright-shared-${stamp}-${rand}@cleanshopper.test`

  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(BASE_URL)
  await page.getByRole('button', { name: 'Create one' }).click()
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Create account' }).click()

  // Wait for the app to land on Browse — confirms the account was created.
  await page.getByRole('heading', { name: 'Browse' }).waitFor({ timeout: 30_000 })

  await browser.close()

  fs.mkdirSync(path.dirname(CREDENTIALS_FILE), { recursive: true })
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ email, password: PASSWORD }))
}
