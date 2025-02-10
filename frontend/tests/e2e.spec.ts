import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Register, log out, log in, make a new listing, and verify it shows on the front page.', async ({ page }) => {
  const baseURL = 'http://localhost:3000';
  const filePath = path.join(__dirname, 'test.png');

  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, token: 'mock-token' }),
    });
  });

  await page.route('**/api/login', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, token: 'mock-token' }),
    });
  });

  await page.route('**/api/categories', route => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Home and Furniture' },
          { id: 2, name: 'Electronics' },
          { id: 3, name: 'Clothing' },
        ]),
      });
    }
  });

  await page.route('**/api/uploads/test.png', async route => {
    if (route.request().method() === 'GET') {
      const imageBuffer = await fs.promises.readFile(filePath);
      route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: imageBuffer,
      });
    }
  });

  await page.route('**/api/listings', route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Listing submitted successfully! Admin will review your listing shortly.' }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, title: 'Test Item', description: 'This is a test item description.', price: 100, category: 'Home and Furniture', image: 'test.png', user: 'user', visible: true }]),
      });
    }
  });

  // Register a new user
  await page.goto(`${baseURL}/register`);
  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'password');
  await page.fill('input[name="confirmPassword"]', 'password');
  await page.click('button[type="submit"]:has-text("Register")');
  await page.click('button:has-text("Log Out")');

  // Log in
  await page.goto(`${baseURL}/login`);
  await page.fill('input[name="username"]', 'user');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]:has-text("Log In")');

  // Make a new listing
  await page.goto(`${baseURL}/newlisting`, { timeout: 5000 });
  await page.fill('input[name="title"]', 'Test Item');
  await page.fill('textarea[name="description"]', 'This is a test item description.');
  await page.fill('input[name="price"]', '100');

  // Select category
  await page.click('#mui-component-select-category');
  await page.click('li[data-value="Home and Furniture"]'); 

  // Upload image and submit listing
  await page.setInputFiles('input[type="file"]', filePath);
  await page.click('button[type="submit"]:has-text("Submit")');
  await expect(page.locator('body')).toContainText('Listing submitted successfully! Admin will review your listing shortly.');

  // Log out
  await page.click('button:has-text("Log Out")');

  // Verify the listing shows on the front page
  await page.goto(baseURL);
  await expect(page.locator('body')).toContainText('Test Item');
  await expect(page.locator('body')).toContainText('This is a test item description.');
  await expect(page.locator('body')).toContainText('100 €');
});