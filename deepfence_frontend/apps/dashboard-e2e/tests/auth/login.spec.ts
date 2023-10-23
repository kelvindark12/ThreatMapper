import { test, expect } from '@playwright/test';
import { AuthPage } from './AuthPage';

test.describe('Login', () => {
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should show email and password error', async ({ browser, baseURL }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);
    await authPage.enterEmail('');
    await authPage.enterPassword('');
    await authPage.submit('Sign In');
    await expect(page.getByText('required field')).toHaveCount(2);
  });

  test('should show invalid credentials', async ({ baseURL, browser }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);
    await authPage.enterEmail('test@test.com');
    await authPage.enterPassword('Password@123');
    await authPage.submit('Sign In');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await page.close();
  });

  test('should show validation message', async ({ baseURL, browser }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);
    await authPage.enterEmail('test@test.com');
    await authPage.enterPassword('Password');
    await authPage.submit('Sign In');
    await expect(
      page.getByText(
        'should contain at least one upper case, lower case, digit and special character',
      ),
    ).toBeVisible();
    await page.close();
  });

  test('redirect to forgot password', async ({ baseURL, browser }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);
    await authPage.clickForgetPassword();
    await expect(page).toHaveURL(/.*forgot-password/);
    await page.close();
  });

  test('redirect to register user', async ({ baseURL, browser }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);
    await authPage.clickRegisterUser();
    await expect(page).toHaveURL(/.*register/);
    await page.close();
  });

  test('should login and logout', async ({ baseURL, browser }) => {
    const page = await browser.newPage({
      storageState: undefined,
    });
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    expect(username).toBeTruthy();
    expect(password).toBeTruthy();

    const authPage = new AuthPage(page);
    await page.goto(`${baseURL}/auth/login`);

    if (
      await page
        .getByRole('button', {
          name: 'sign in',
        })
        .isVisible()
    ) {
      await authPage.enterEmail(username!);
      await authPage.enterPassword(password!);
      await authPage.submit('Sign In');
      await expect(page).toHaveURL(/.*board/);

      // logout
      const logoutButton = page.getByTestId('logoutUserButtonId');
      await logoutButton.click();
      const logoutMenuItem = page.getByTestId('logoutDropdownItemId');
      await expect(logoutMenuItem).toBeVisible();
      await logoutMenuItem.click();
      await expect(page).toHaveURL(/.*login/);
    } else {
      const logoutButton = page.getByTestId('logoutUserButtonId');
      await logoutButton.click();
      const logoutMenuItem = page.getByTestId('logoutDropdownItemId');
      await expect(logoutMenuItem).toBeVisible();
      await logoutMenuItem.click();
      await expect(page).toHaveURL(/.*login/);
    }
    await page.close();
  });
});
