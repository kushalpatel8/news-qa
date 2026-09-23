import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should redirect to sign-in from protected dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Clerk should intercept and redirect to sign-in page
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test('should render sign-in page correctly', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check if the Clerk sign in widget is present (it might take a moment to load)
    // Wait for the main container provided by Clerk
    await page.waitForSelector('.cl-signIn-root, .cl-rootBox');
    
    // The exact text depends on Clerk configuration, but "Sign in" is standard
    await expect(page.locator('body')).toContainText('Sign in');
  });
});
