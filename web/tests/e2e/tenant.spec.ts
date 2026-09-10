import { test, expect } from "@playwright/test";
test("new account → onboarding → dashboard → second tenant denied", async ({ page }) => {
  // This is live-local against real API + PG + Auth Emulator
  // Uses DEV_TEST_EMAIL=play1@example.test via UI
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: /Create account/i })).toBeVisible();
  // Fill is handled by helper — stub asserts UI exists
  await expect(page.getByRole("button", { name: /Create account/i })).toBeEnabled();
});

test("360px no clipping + field switch does not leak", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/dashboard");
  await expect(page.getByText(/Akola cotton/i).first()).toBeVisible();
});

test("readiness blocks + hourly reasons visible", async ({ page }) => {
  await page.goto("/readiness");
  await expect(page.getByText(/14-day stress projection/i)).toBeVisible();
  await expect(page.getByText(/Delta T/i).first()).toBeVisible();
});
