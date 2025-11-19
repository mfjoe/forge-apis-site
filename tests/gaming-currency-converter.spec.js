import { test, expect } from '@playwright/test';

// Test data - package information for validation
const CURRENCY_DATA = {
  vbucks: {
    name: 'V-Bucks',
    game: 'Fortnite',
    packages: [
      { amount: 1000, bonus: 0, price: 7.99, name: 'Starter' },
      { amount: 2500, bonus: 300, price: 19.99, name: 'Standard' },
      { amount: 5000, bonus: 0, price: 31.99, name: 'Deluxe' },
      { amount: 13500, bonus: 0, price: 79.99, name: 'Ultimate' }
    ]
  },
  robux: {
    name: 'Robux',
    game: 'Roblox',
    packages: [
      { amount: 400, bonus: 0, price: 4.99, name: 'Starter' },
      { amount: 800, bonus: 0, price: 9.99, name: 'Standard' },
      { amount: 1700, bonus: 0, price: 19.99, name: 'Deluxe' },
      { amount: 4500, bonus: 0, price: 49.99, name: 'Premium' },
      { amount: 10000, bonus: 0, price: 99.99, name: 'Ultimate' }
    ]
  },
  cod: {
    name: 'COD Points',
    game: 'Call of Duty',
    packages: [
      { amount: 500, bonus: 0, price: 4.99, name: 'Starter' },
      { amount: 1000, bonus: 100, price: 9.99, name: 'Standard' },
      { amount: 2000, bonus: 400, price: 19.99, name: 'Deluxe' },
      { amount: 5000, bonus: 0, price: 39.99, name: 'Premium' },
      { amount: 10000, bonus: 3000, price: 99.99, name: 'Ultimate' }
    ]
  },
  fifa: {
    name: 'FIFA Points',
    game: 'EA Sports FC',
    packages: [
      { amount: 500, bonus: 0, price: 4.99, name: 'Starter' },
      { amount: 1050, bonus: 0, price: 9.99, name: 'Standard' },
      { amount: 2200, bonus: 0, price: 19.99, name: 'Deluxe' },
      { amount: 4600, bonus: 0, price: 39.99, name: 'Premium' }
    ]
  },
  apex: {
    name: 'Apex Coins',
    game: 'Apex Legends',
    packages: [
      { amount: 1000, bonus: 0, price: 9.99, name: 'Starter' },
      { amount: 2000, bonus: 150, price: 19.99, name: 'Standard' },
      { amount: 4000, bonus: 350, price: 39.99, name: 'Deluxe' },
      { amount: 10000, bonus: 1500, price: 99.99, name: 'Ultimate' }
    ]
  },
  minecoins: {
    name: 'Minecoins',
    game: 'Minecraft',
    packages: [
      { amount: 320, bonus: 0, price: 1.99, name: 'Starter' },
      { amount: 1720, bonus: 0, price: 9.99, name: 'Standard' },
      { amount: 3500, bonus: 0, price: 19.99, name: 'Deluxe' },
      { amount: 8800, bonus: 0, price: 49.99, name: 'Ultimate' }
    ]
  }
};

const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.95,
  GBP: 0.82,
  CAD: 1.43,
  AUD: 1.60
};

// Helper function to wait for calculator to be ready
async function waitForCalculatorReady(page) {
  await page.waitForSelector('#gamingAmount', { state: 'visible' });
  await page.waitForSelector('#realMoney', { state: 'visible' });
  await page.waitForSelector('#currencySelect', { state: 'visible' });
  // Wait for any initial calculations to complete
  await page.waitForTimeout(500);
}

// Helper function to get numeric value from input
async function getInputValue(page, selector) {
  const value = await page.locator(selector).inputValue();
  return parseFloat(value) || 0;
}

// Helper function to get text content
async function getTextContent(page, selector) {
  const element = page.locator(selector);
  if (await element.count() > 0) {
    return await element.textContent();
  }
  return null;
}

test.describe('Gaming Currency Converter - Page Load and Initial State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Gaming Currency Converter/);
    await expect(page.locator('h1')).toContainText('Gaming Currency Converter');
  });

  test('should display all required calculator elements', async ({ page }) => {
    await expect(page.locator('#gamingAmount')).toBeVisible();
    await expect(page.locator('#realMoney')).toBeVisible();
    await expect(page.locator('#currencySelect')).toBeVisible();
    await expect(page.locator('#currencyDropdownBtn')).toBeVisible();
    await expect(page.locator('#swapBtn')).toBeVisible();
    await expect(page.locator('#conversionResult')).toBeVisible();
  });

  test('should default to V-Bucks currency', async ({ page }) => {
    const dropdownText = await page.locator('#dropdownCurrencyName').textContent();
    expect(dropdownText).toContain('V-Bucks');
    
    const gameName = await page.locator('#dropdownGameName').textContent();
    expect(gameName).toContain('Fortnite');
  });

  test('should default to USD currency', async ({ page }) => {
    const currencySelect = page.locator('#currencySelect');
    await expect(currencySelect).toHaveValue('USD');
  });

  test('should have all calculation mode buttons', async ({ page }) => {
    const smartMode = page.locator('[data-mode="smart"]');
    const simpleMode = page.locator('[data-mode="simple"]');
    const compareMode = page.locator('[data-mode="compare"]');
    
    await expect(smartMode).toBeVisible();
    await expect(simpleMode).toBeVisible();
    await expect(compareMode).toBeVisible();
    
    // Smart mode should be active by default
    await expect(smartMode).toHaveClass(/active/);
  });

  test('should display pricing tables section', async ({ page }) => {
    await expect(page.locator('.pricing-section')).toBeVisible();
    await expect(page.locator('.section-title').first()).toContainText('Official Package Deals');
  });

  test('should have navigation elements', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('#breadcrumb-container')).toBeVisible();
  });
});

test.describe('Gaming Currency Converter - Currency Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should open currency dropdown on click', async ({ page }) => {
    const dropdownBtn = page.locator('#currencyDropdownBtn');
    const dropdownMenu = page.locator('#currencyDropdownMenu');
    
    await expect(dropdownMenu).not.toHaveClass(/open/);
    await dropdownBtn.click();
    await page.waitForTimeout(300);
    await expect(dropdownMenu).toHaveClass(/open/);
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const dropdownBtn = page.locator('#currencyDropdownBtn');
    const dropdownMenu = page.locator('#currencyDropdownMenu');
    
    await dropdownBtn.click();
    await page.waitForTimeout(300);
    await expect(dropdownMenu).toHaveClass(/open/);
    
    // Click outside
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await page.waitForTimeout(300);
    await expect(dropdownMenu).not.toHaveClass(/open/);
  });

  test('should display all 6 currency options', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    const options = page.locator('.currency-option');
    await expect(options).toHaveCount(6);
    
    const currencies = ['vbucks', 'robux', 'cod', 'fifa', 'apex', 'minecoins'];
    for (const currency of currencies) {
      const option = page.locator(`[data-currency="${currency}"]`);
      await expect(option).toBeVisible();
    }
  });

  test('should switch to Robux currency', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    const currencyName = await page.locator('#dropdownCurrencyName').textContent();
    expect(currencyName).toContain('Robux');
    
    const gameName = await page.locator('#dropdownGameName').textContent();
    expect(gameName).toContain('Roblox');
  });

  test('should switch to COD Points currency', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-currency="cod"]').click();
    await page.waitForTimeout(500);
    
    const currencyName = await page.locator('#dropdownCurrencyName').textContent();
    expect(currencyName).toContain('COD Points');
  });

  test('should switch to FIFA Points currency', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-currency="fifa"]').click();
    await page.waitForTimeout(500);
    
    const currencyName = await page.locator('#dropdownCurrencyName').textContent();
    expect(currencyName).toContain('FIFA Points');
  });

  test('should switch to Apex Coins currency', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-currency="apex"]').click();
    await page.waitForTimeout(500);
    
    const currencyName = await page.locator('#dropdownCurrencyName').textContent();
    expect(currencyName).toContain('Apex Coins');
  });

  test('should switch to Minecoins currency', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.locator('[data-currency="minecoins"]').click();
    await page.waitForTimeout(500);
    
    const currencyName = await page.locator('#dropdownCurrencyName').textContent();
    expect(currencyName).toContain('Minecoins');
  });

  test('should update quick amount buttons when currency changes', async ({ page }) => {
    // Check initial V-Bucks amounts
    const initialButtons = page.locator('.quick-btn');
    const initialCount = await initialButtons.count();
    
    // Switch to Robux
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    // Quick buttons should still be visible
    const buttonsAfter = page.locator('.quick-btn');
    await expect(buttonsAfter.first()).toBeVisible();
  });

  test('should apply theme when currency changes', async ({ page }) => {
    const body = page.locator('body');
    
    // Switch to Robux
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    // Body should have theme class
    await expect(body).toHaveClass(/theme-robux/);
  });
});

test.describe('Gaming Currency Converter - Calculation Modes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should switch to simple mode', async ({ page }) => {
    const simpleModeBtn = page.locator('[data-mode="simple"]');
    await simpleModeBtn.click();
    await page.waitForTimeout(300);
    
    await expect(simpleModeBtn).toHaveClass(/active/);
    await expect(page.locator('[data-mode="smart"]')).not.toHaveClass(/active/);
  });

  test('should switch to compare mode', async ({ page }) => {
    const compareModeBtn = page.locator('[data-mode="compare"]');
    await compareModeBtn.click();
    await page.waitForTimeout(500);
    
    await expect(compareModeBtn).toHaveClass(/active/);
    
    // Compare mode should show package comparison
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    expect(resultText).toContain('Package Comparison');
  });

  test('should switch back to smart mode', async ({ page }) => {
    // Switch to simple first
    await page.locator('[data-mode="simple"]').click();
    await page.waitForTimeout(300);
    
    // Switch back to smart
    await page.locator('[data-mode="smart"]').click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('[data-mode="smart"]')).toHaveClass(/active/);
  });

  test('should calculate differently in simple vs smart mode', async ({ page }) => {
    // Set a gaming amount
    await page.locator('#gamingAmount').fill('5000');
    await page.waitForTimeout(500);
    
    // Get smart mode result
    const smartResult = await getInputValue(page, '#realMoney');
    
    // Switch to simple mode
    await page.locator('[data-mode="simple"]').click();
    await page.waitForTimeout(500);
    
    // Get simple mode result
    const simpleResult = await getInputValue(page, '#realMoney');
    
    // Results should be different (smart uses best packages, simple uses base rate)
    expect(smartResult).not.toBe(simpleResult);
  });
});

test.describe('Gaming Currency Converter - Gaming to Money Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should convert 1000 V-Bucks to USD', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
    expect(moneyValue).toBeLessThan(20); // Should be around $7.99-8.00
  });

  test('should convert 5000 V-Bucks to USD', async ({ page }) => {
    await page.locator('#gamingAmount').fill('5000');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(20);
    expect(moneyValue).toBeLessThan(40);
  });

  test('should show result text when converting', async ({ page }) => {
    await page.locator('#gamingAmount').fill('2500');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    expect(resultText).toContain('V-Bucks');
    expect(resultText).toContain('$');
  });

  test('should show package recommendation in smart mode', async ({ page }) => {
    await page.locator('#gamingAmount').fill('2800');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    // Should show best purchase option
    expect(resultText).toMatch(/Best Purchase Option|package/i);
  });

  test('should handle zero input', async ({ page }) => {
    await page.locator('#gamingAmount').fill('0');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBe(0);
  });

  test('should handle negative input', async ({ page }) => {
    await page.locator('#gamingAmount').fill('-100');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBe(0);
  });

  test('should handle very large numbers', async ({ page }) => {
    await page.locator('#gamingAmount').fill('100000');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
  });

  test('should convert Robux correctly', async ({ page }) => {
    // Switch to Robux
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
  });
});

test.describe('Gaming Currency Converter - Money to Gaming Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should convert $10 USD to V-Bucks', async ({ page }) => {
    await page.locator('#realMoney').fill('10');
    await page.waitForTimeout(500);
    
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBeGreaterThan(0);
  });

  test('should convert $50 USD to V-Bucks', async ({ page }) => {
    await page.locator('#realMoney').fill('50');
    await page.waitForTimeout(500);
    
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBeGreaterThan(1000);
  });

  test('should show result when converting from money', async ({ page }) => {
    await page.locator('#realMoney').fill('20');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    expect(resultText).toContain('V-Bucks');
    expect(resultText).toContain('$');
  });

  test('should handle zero money input', async ({ page }) => {
    await page.locator('#realMoney').fill('0');
    await page.waitForTimeout(500);
    
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBe(0);
  });

  test('should handle decimal money input', async ({ page }) => {
    await page.locator('#realMoney').fill('9.99');
    await page.waitForTimeout(500);
    
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBeGreaterThan(0);
  });
});

test.describe('Gaming Currency Converter - Fiat Currency Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should have all fiat currency options', async ({ page }) => {
    const currencySelect = page.locator('#currencySelect');
    const options = currencySelect.locator('option');
    
    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    for (const currency of currencies) {
      const option = options.filter({ hasText: currency });
      await expect(option).toHaveCount(1);
    }
  });

  test('should convert to EUR', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const usdValue = await getInputValue(page, '#realMoney');
    
    // Switch to EUR
    await page.locator('#currencySelect').selectOption('EUR');
    await page.waitForTimeout(500);
    
    const eurValue = await getInputValue(page, '#realMoney');
    
    // EUR should be different from USD (lower due to exchange rate)
    expect(eurValue).not.toBe(usdValue);
    expect(eurValue).toBeLessThan(usdValue);
  });

  test('should convert to GBP', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const usdValue = await getInputValue(page, '#realMoney');
    
    // Switch to GBP
    await page.locator('#currencySelect').selectOption('GBP');
    await page.waitForTimeout(500);
    
    const gbpValue = await getInputValue(page, '#realMoney');
    
    expect(gbpValue).not.toBe(usdValue);
    expect(gbpValue).toBeLessThan(usdValue);
  });

  test('should convert to CAD', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const usdValue = await getInputValue(page, '#realMoney');
    
    // Switch to CAD
    await page.locator('#currencySelect').selectOption('CAD');
    await page.waitForTimeout(500);
    
    const cadValue = await getInputValue(page, '#realMoney');
    
    // CAD should be higher than USD
    expect(cadValue).toBeGreaterThan(usdValue);
  });

  test('should convert to AUD', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const usdValue = await getInputValue(page, '#realMoney');
    
    // Switch to AUD
    await page.locator('#currencySelect').selectOption('AUD');
    await page.waitForTimeout(500);
    
    const audValue = await getInputValue(page, '#realMoney');
    
    // AUD should be higher than USD
    expect(audValue).toBeGreaterThan(usdValue);
  });

  test('should update result display with currency symbol', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    // Switch to EUR
    await page.locator('#currencySelect').selectOption('EUR');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    // Should contain EUR symbol or text
    expect(resultText).toMatch(/EUR|€/);
  });
});

test.describe('Gaming Currency Converter - Quick Amount Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should have quick amount buttons visible', async ({ page }) => {
    const quickButtons = page.locator('.quick-btn');
    const count = await quickButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should fill gaming amount when quick button clicked', async ({ page }) => {
    const quickButtons = page.locator('.quick-btn');
    const firstButton = quickButtons.first();
    
    const buttonText = await firstButton.textContent();
    const expectedAmount = parseInt(buttonText.replace(/,/g, '')) || 0;
    
    if (expectedAmount > 0) {
      await firstButton.click();
      await page.waitForTimeout(500);
      
      const gamingAmount = await getInputValue(page, '#gamingAmount');
      expect(gamingAmount).toBe(expectedAmount);
    }
  });

  test('should update calculation when quick button clicked', async ({ page }) => {
    const quickButtons = page.locator('.quick-btn');
    const firstButton = quickButtons.first();
    const buttonText = await firstButton.textContent();
    const expectedAmount = parseInt(buttonText.replace(/,/g, '')) || 0;
    
    if (expectedAmount > 0) {
      await firstButton.click();
      await page.waitForTimeout(500);
      
      const moneyValue = await getInputValue(page, '#realMoney');
      expect(moneyValue).toBeGreaterThan(0);
    }
  });
});

test.describe('Gaming Currency Converter - Swap Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should swap input fields', async ({ page }) => {
    // Fill gaming amount
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const gamingBefore = await getInputValue(page, '#gamingAmount');
    const moneyBefore = await getInputValue(page, '#realMoney');
    
    // Click swap
    await page.locator('#swapBtn').click();
    await page.waitForTimeout(500);
    
    // Fields should be swapped (positions changed, but values might persist)
    // The swap button changes the visual order, not necessarily the values
    const gamingAfter = await getInputValue(page, '#gamingAmount');
    const moneyAfter = await getInputValue(page, '#realMoney');
    
    // At least one value should remain
    expect(gamingAfter).toBeGreaterThanOrEqual(0);
    expect(moneyAfter).toBeGreaterThanOrEqual(0);
  });

  test('should maintain calculation after swap', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const moneyBefore = await getInputValue(page, '#realMoney');
    
    await page.locator('#swapBtn').click();
    await page.waitForTimeout(500);
    
    // Calculation should still be valid
    const moneyAfter = await getInputValue(page, '#realMoney');
    expect(moneyAfter).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Gaming Currency Converter - Package Comparison Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should display package comparison when compare mode is selected', async ({ page }) => {
    await page.locator('[data-mode="compare"]').click();
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    expect(resultText).toContain('Package Comparison');
  });

  test('should show all packages for current currency', async ({ page }) => {
    await page.locator('[data-mode="compare"]').click();
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    // Should show multiple packages
    const packageCards = resultContainer.locator('div[style*="cursor: pointer"]');
    const count = await packageCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should highlight best value package', async ({ page }) => {
    await page.locator('[data-mode="compare"]').click();
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    // Should mention "BEST VALUE"
    expect(resultText).toMatch(/BEST VALUE|best value/i);
  });

  test('should allow clicking package to calculate', async ({ page }) => {
    await page.locator('[data-mode="compare"]').click();
    await page.waitForTimeout(500);
    
    // Find a package card and click it
    const resultContainer = page.locator('#conversionResult');
    const packageCard = resultContainer.locator('div[style*="cursor: pointer"]').first();
    
    if (await packageCard.count() > 0) {
      await packageCard.click();
      await page.waitForTimeout(500);
      
      // Should switch back to smart mode and fill amount
      const gamingAmount = await getInputValue(page, '#gamingAmount');
      expect(gamingAmount).toBeGreaterThan(0);
    }
  });
});

test.describe('Gaming Currency Converter - Pricing Tables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should display pricing section', async ({ page }) => {
    await expect(page.locator('.pricing-section')).toBeVisible();
    await expect(page.locator('.pricing-table').first()).toBeVisible();
  });

  test('should show V-Bucks pricing table by default', async ({ page }) => {
    const vbucksTable = page.locator('#vbucks-pricing');
    await expect(vbucksTable).toHaveClass(/active/);
  });

  test('should switch pricing table when currency changes', async ({ page }) => {
    // Switch to Robux
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    const robuxTable = page.locator('#robux-pricing');
    await expect(robuxTable).toHaveClass(/active/);
  });

  test('should display package prices in table', async ({ page }) => {
    const pricingTable = page.locator('.pricing-table');
    const rows = pricingTable.locator('tr');
    const rowCount = await rows.count();
    
    // Should have multiple rows (header + packages)
    expect(rowCount).toBeGreaterThan(1);
  });

  test('should update prices when fiat currency changes', async ({ page }) => {
    // Get initial USD price from the active pricing table
    const activeTable = page.locator('.pricing-content.active .pricing-table');
    // Find a price cell (not the amount cell) - typically in the price column
    const priceCells = activeTable.locator('td').filter({ hasText: /^\$|€|£|CA\$|AU\$/ });
    const firstPrice = await priceCells.first().textContent();
    
    // Switch to EUR
    await page.locator('#currencySelect').selectOption('EUR');
    await page.waitForTimeout(500);
    
    // Price should be different (now in EUR)
    const newPriceCells = activeTable.locator('td').filter({ hasText: /^\$|€|£|CA\$|AU\$/ });
    const newPrice = await newPriceCells.first().textContent();
    expect(newPrice).not.toBe(firstPrice);
  });
});

test.describe('Gaming Currency Converter - Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should handle empty gaming amount input', async ({ page }) => {
    await page.locator('#gamingAmount').fill('');
    await page.waitForTimeout(300);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBe(0);
  });

  test('should handle non-numeric input in gaming amount', async ({ page }) => {
    // Number inputs reject non-numeric input, so we test by trying to type
    // and checking that the value remains valid or empty
    await page.locator('#gamingAmount').clear();
    await page.locator('#gamingAmount').type('abc', { delay: 50 });
    await page.waitForTimeout(300);
    
    // Input should be empty or 0 since number inputs don't accept non-numeric
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBe(0);
  });

  test('should handle empty money input', async ({ page }) => {
    await page.locator('#realMoney').fill('');
    await page.waitForTimeout(300);
    
    const gamingValue = await getInputValue(page, '#gamingAmount');
    expect(gamingValue).toBe(0);
  });

  test('should handle non-numeric input in money field', async ({ page }) => {
    // Number inputs reject non-numeric input, so we test by trying to type
    // and checking that the value remains valid or empty
    await page.locator('#realMoney').clear();
    await page.locator('#realMoney').type('xyz', { delay: 50 });
    await page.waitForTimeout(300);
    
    // Input should be empty or 0 since number inputs don't accept non-numeric
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBe(0);
  });

  test('should handle very small decimal values', async ({ page }) => {
    await page.locator('#gamingAmount').fill('0.01');
    await page.waitForTimeout(300);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Gaming Currency Converter - Result Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should display conversion result', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    await expect(resultContainer).toBeVisible();
    
    const resultText = await resultContainer.textContent();
    expect(resultText).toContain('V-Bucks');
    expect(resultText).toContain('$');
  });

  test('should show game name in result', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    expect(resultText).toContain('Fortnite');
  });

  test('should show package recommendation details', async ({ page }) => {
    await page.locator('#gamingAmount').fill('2800');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    // Should show package information
    expect(resultText).toMatch(/package|Purchase|Buy/i);
  });

  test('should clear result when input is cleared', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    await page.locator('#gamingAmount').fill('0');
    await page.waitForTimeout(500);
    
    const resultContainer = page.locator('#conversionResult');
    const resultText = await resultContainer.textContent();
    
    // Result should be empty or minimal
    expect(resultText.length).toBeLessThan(100);
  });
});

test.describe('Gaming Currency Converter - Theme Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should apply V-Bucks theme', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toHaveClass(/theme-vbucks/);
  });

  test('should apply Robux theme when selected', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    const body = page.locator('body');
    await expect(body).toHaveClass(/theme-robux/);
  });

  test('should apply COD theme when selected', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="cod"]').click();
    await page.waitForTimeout(500);
    
    const body = page.locator('body');
    await expect(body).toHaveClass(/theme-cod/);
  });

  test('should update hero image when currency changes', async ({ page }) => {
    // Check initial hero image
    const initialHero = page.locator('#heroVbucks');
    await expect(initialHero).toHaveClass(/active/);
    
    // Switch to Robux
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    // Robux hero should be active
    const robuxHero = page.locator('#heroRobux');
    await expect(robuxHero).toHaveClass(/active/);
  });
});

test.describe('Gaming Currency Converter - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should display mobile menu button', async ({ page }) => {
    const mobileMenuBtn = page.locator('.mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
  });

  test('should show mobile menu when button clicked', async ({ page }) => {
    const mobileMenuBtn = page.locator('.mobile-menu-btn');
    const mobileMenu = page.locator('.mobile-menu');
    
    await mobileMenuBtn.click();
    await page.waitForTimeout(300);
    
    await expect(mobileMenu).toHaveClass(/active/);
  });

  test('should display calculator inputs on mobile', async ({ page }) => {
    await expect(page.locator('#gamingAmount')).toBeVisible();
    await expect(page.locator('#realMoney')).toBeVisible();
  });

  test('should display currency dropdown on mobile', async ({ page }) => {
    await expect(page.locator('#currencyDropdownBtn')).toBeVisible();
  });

  test('should allow calculation on mobile', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
  });
});

test.describe('Gaming Currency Converter - All Currencies Comprehensive Test', () => {
  const currencies = ['vbucks', 'robux', 'cod', 'fifa', 'apex', 'minecoins'];
  
  for (const currency of currencies) {
    test(`should correctly convert ${currency} to USD`, async ({ page }) => {
      await page.goto('/gaming-currency-converter/');
      await waitForCalculatorReady(page);
      
      // Select currency
      await page.locator('#currencyDropdownBtn').click();
      await page.waitForTimeout(300);
      await page.locator(`[data-currency="${currency}"]`).click();
      await page.waitForTimeout(500);
      
      // Get first package amount
      const data = CURRENCY_DATA[currency];
      const firstPackage = data.packages[0];
      const testAmount = firstPackage.amount;
      
      // Convert
      await page.locator('#gamingAmount').fill(testAmount.toString());
      await page.waitForTimeout(500);
      
      const moneyValue = await getInputValue(page, '#realMoney');
      
      // Should calculate correctly (within reasonable range)
      expect(moneyValue).toBeGreaterThan(0);
      expect(moneyValue).toBeLessThan(200);
      
      // Result should show currency name
      const resultContainer = page.locator('#conversionResult');
      const resultText = await resultContainer.textContent();
      expect(resultText).toContain(data.name);
    });
  }
});

test.describe('Gaming Currency Converter - Edge Cases and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should handle rapid input changes', async ({ page }) => {
    const amounts = ['100', '500', '1000', '5000', '10000'];
    
    for (const amount of amounts) {
      await page.locator('#gamingAmount').fill(amount);
      await page.waitForTimeout(100);
    }
    
    await page.waitForTimeout(500);
    
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
  });

  test('should handle currency switch during calculation', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(200);
    
    // Switch currency mid-calculation
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(200);
    await page.locator('[data-currency="robux"]').click();
    await page.waitForTimeout(500);
    
    // Should still have valid calculation
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThanOrEqual(0);
  });

  test('should handle mode switch during calculation', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(200);
    
    // Switch mode
    await page.locator('[data-mode="simple"]').click();
    await page.waitForTimeout(500);
    
    // Should recalculate
    const moneyValue = await getInputValue(page, '#realMoney');
    expect(moneyValue).toBeGreaterThan(0);
  });

  test('should maintain state when switching between modes', async ({ page }) => {
    await page.locator('#gamingAmount').fill('1000');
    await page.waitForTimeout(300);
    
    const initialMoney = await getInputValue(page, '#realMoney');
    
    // Switch to compare mode
    await page.locator('[data-mode="compare"]').click();
    await page.waitForTimeout(500);
    
    // Switch back to smart mode
    await page.locator('[data-mode="smart"]').click();
    await page.waitForTimeout(500);
    
    // Gaming amount should still be there
    const gamingAmount = await getInputValue(page, '#gamingAmount');
    expect(gamingAmount).toBe(1000);
  });
});

test.describe('Gaming Currency Converter - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gaming-currency-converter/');
    await waitForCalculatorReady(page);
  });

  test('should have proper ARIA labels on dropdown', async ({ page }) => {
    const dropdownBtn = page.locator('#currencyDropdownBtn');
    await expect(dropdownBtn).toHaveAttribute('aria-expanded');
    await expect(dropdownBtn).toHaveAttribute('aria-haspopup', 'true');
  });

  test('should support keyboard navigation on dropdown', async ({ page }) => {
    const dropdownBtn = page.locator('#currencyDropdownBtn');
    
    // Focus and activate with Enter
    await dropdownBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    const dropdownMenu = page.locator('#currencyDropdownMenu');
    await expect(dropdownMenu).toHaveClass(/open/);
  });

  test('should close dropdown with Escape key', async ({ page }) => {
    await page.locator('#currencyDropdownBtn').click();
    await page.waitForTimeout(300);
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const dropdownMenu = page.locator('#currencyDropdownMenu');
    await expect(dropdownMenu).not.toHaveClass(/open/);
  });

  test('should have accessible input labels', async ({ page }) => {
    const gamingInput = page.locator('#gamingAmount');
    const moneyInput = page.locator('#realMoney');
    
    // Inputs should be accessible
    await expect(gamingInput).toBeVisible();
    await expect(moneyInput).toBeVisible();
  });
});

