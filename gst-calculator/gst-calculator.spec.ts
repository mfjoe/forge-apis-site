import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive GST Calculator Test Suite
 * Tests GST calculations for forgeapis.com/gst-calculator
 * Covers all GST rates, modes, transaction types, and edge cases
 */

const BASE_URL = 'https://forgeapis.com/gst-calculator';

// Helper function to format currency as Indian Rupees
const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to parse Indian formatted number
const parseIndianCurrency = (text: string): number => {
  return parseFloat(text.replace(/[₹,]/g, '').trim());
};

test.describe('GST Calculator - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should load the GST calculator page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/GST Calculator/i);
    await expect(page.locator('#amount')).toBeVisible();
  });

  test('should have all required input elements', async ({ page }) => {
    await expect(page.locator('#amount')).toBeVisible();
    await expect(page.locator('#gstRateDropdown')).toBeVisible();
    await expect(page.locator('.simple-mode-btn')).toBeVisible();
    await expect(page.locator('.advanced-mode-btn')).toBeVisible();
  });

  test('should default to GST Exclusive (Add GST) mode', async ({ page }) => {
    const exclusiveBtn = page.locator('.type-btn:has-text("GST Exclusive")');
    await expect(exclusiveBtn).toHaveClass(/active/);
  });

  test('should default to Intrastate transaction', async ({ page }) => {
    const intrastateBtn = page.locator('.type-btn:has-text("Intrastate")');
    await expect(intrastateBtn).toHaveClass(/active/);
  });
});

test.describe('GST Calculator - All GST Rates (Exclusive Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Ensure we're in GST Exclusive mode
    await page.click('.type-btn:has-text("GST Exclusive")');
  });

  test('should calculate 0% GST correctly', async ({ page }) => {
    const amount = 10000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '0');
    await page.waitForTimeout(500); // Wait for calculation

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    expect(parseIndianCurrency(totalGst!)).toBe(0);
    expect(parseIndianCurrency(totalAmount!)).toBe(10000);
  });

  test('should calculate 0.25% GST correctly (Rough Diamonds)', async ({ page }) => {
    const amount = 100000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '0.25');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 0.25% = 100000 × 0.0025 = 250
    expect(parseIndianCurrency(totalGst!)).toBe(250);
    expect(parseIndianCurrency(totalAmount!)).toBe(100250);
  });

  test('should calculate 3% GST correctly (Gold/Precious Metals)', async ({ page }) => {
    const amount = 50000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '3');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 3% = 50000 × 0.03 = 1500
    expect(parseIndianCurrency(totalGst!)).toBe(1500);
    expect(parseIndianCurrency(totalAmount!)).toBe(51500);
  });

  test('should calculate 5% GST correctly (Essential Items)', async ({ page }) => {
    const amount = 20000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '5');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 5% = 20000 × 0.05 = 1000
    expect(parseIndianCurrency(totalGst!)).toBe(1000);
    expect(parseIndianCurrency(totalAmount!)).toBe(21000);
  });

  test('should calculate 12% GST correctly (Standard Goods)', async ({ page }) => {
    const amount = 25000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '12');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 12% = 25000 × 0.12 = 3000
    expect(parseIndianCurrency(totalGst!)).toBe(3000);
    expect(parseIndianCurrency(totalAmount!)).toBe(28000);
  });

  test('should calculate 18% GST correctly (Services)', async ({ page }) => {
    const amount = 10000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 18% = 10000 × 0.18 = 1800
    expect(parseIndianCurrency(totalGst!)).toBe(1800);
    expect(parseIndianCurrency(totalAmount!)).toBe(11800);
  });

  test('should calculate 28% GST correctly (Luxury Items)', async ({ page }) => {
    const amount = 100000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '28');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Formula: GST = Amount × 28% = 100000 × 0.28 = 28000
    expect(parseIndianCurrency(totalGst!)).toBe(28000);
    expect(parseIndianCurrency(totalAmount!)).toBe(128000);
  });
});

test.describe('GST Calculator - GST Inclusive Mode (Remove GST)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Switch to GST Inclusive mode
    await page.click('.type-btn:has-text("GST Inclusive")');
  });

  test('should calculate reverse GST at 18% correctly', async ({ page }) => {
    const totalAmount = 11800;
    await page.fill('#amount', totalAmount.toString());
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const originalAmount = await page.locator('#originalAmount').textContent();
    const totalGst = await page.locator('#totalGst').textContent();

    // Formula: Original = Total / (1 + GST%) = 11800 / 1.18 = 10000
    // GST = Total - Original = 11800 - 10000 = 1800
    expect(parseIndianCurrency(originalAmount!)).toBeCloseTo(10000, 0);
    expect(parseIndianCurrency(totalGst!)).toBeCloseTo(1800, 0);
  });

  test('should calculate reverse GST at 5% correctly', async ({ page }) => {
    const totalAmount = 21000;
    await page.fill('#amount', totalAmount.toString());
    await page.selectOption('#gstRateDropdown', '5');
    await page.waitForTimeout(500);

    const originalAmount = await page.locator('#originalAmount').textContent();
    const totalGst = await page.locator('#totalGst').textContent();

    // Formula: Original = Total / (1 + GST%) = 21000 / 1.05 = 20000
    expect(parseIndianCurrency(originalAmount!)).toBeCloseTo(20000, 0);
    expect(parseIndianCurrency(totalGst!)).toBeCloseTo(1000, 0);
  });

  test('should calculate reverse GST at 28% correctly', async ({ page }) => {
    const totalAmount = 128000;
    await page.fill('#amount', totalAmount.toString());
    await page.selectOption('#gstRateDropdown', '28');
    await page.waitForTimeout(500);

    const originalAmount = await page.locator('#originalAmount').textContent();
    const totalGst = await page.locator('#totalGst').textContent();

    // Formula: Original = Total / (1 + GST%) = 128000 / 1.28 = 100000
    expect(parseIndianCurrency(originalAmount!)).toBeCloseTo(100000, 0);
    expect(parseIndianCurrency(totalGst!)).toBeCloseTo(28000, 0);
  });
});

test.describe('GST Calculator - CGST/SGST Breakdown (Intrastate)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Ensure Intrastate is selected
    await page.click('.type-btn:has-text("Intrastate")');
  });

  test('should split 18% GST into 9% CGST + 9% SGST', async ({ page }) => {
    const amount = 10000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const cgst = await page.locator('#cgstAmount').textContent();
    const sgst = await page.locator('#sgstAmount').textContent();
    const totalGst = await page.locator('#totalGst').textContent();

    // Formula: CGST = SGST = (Amount × GST%) / 2
    // CGST = SGST = (10000 × 18%) / 2 = 900
    expect(parseIndianCurrency(cgst!)).toBe(900);
    expect(parseIndianCurrency(sgst!)).toBe(900);
    expect(parseIndianCurrency(totalGst!)).toBe(1800);
  });

  test('should split 28% GST into 14% CGST + 14% SGST', async ({ page }) => {
    const amount = 50000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '28');
    await page.waitForTimeout(500);

    const cgst = await page.locator('#cgstAmount').textContent();
    const sgst = await page.locator('#sgstAmount').textContent();

    // CGST = SGST = (50000 × 28%) / 2 = 7000
    expect(parseIndianCurrency(cgst!)).toBe(7000);
    expect(parseIndianCurrency(sgst!)).toBe(7000);
  });

  test('should not show IGST for intrastate transactions', async ({ page }) => {
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const igst = await page.locator('#igstAmount').textContent();
    expect(parseIndianCurrency(igst!)).toBe(0);
  });
});

test.describe('GST Calculator - IGST (Interstate)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Switch to Interstate
    await page.click('.type-btn:has-text("Interstate")');
  });

  test('should show 18% as IGST for interstate transactions', async ({ page }) => {
    const amount = 10000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const igst = await page.locator('#igstAmount').textContent();
    const cgst = await page.locator('#cgstAmount').textContent();
    const sgst = await page.locator('#sgstAmount').textContent();

    // For interstate: IGST = Full GST amount
    expect(parseIndianCurrency(igst!)).toBe(1800);
    expect(parseIndianCurrency(cgst!)).toBe(0);
    expect(parseIndianCurrency(sgst!)).toBe(0);
  });

  test('should show 28% as IGST for interstate luxury goods', async ({ page }) => {
    const amount = 100000;
    await page.fill('#amount', amount.toString());
    await page.selectOption('#gstRateDropdown', '28');
    await page.waitForTimeout(500);

    const igst = await page.locator('#igstAmount').textContent();
    expect(parseIndianCurrency(igst!)).toBe(28000);
  });
});

test.describe('GST Calculator - Quick Preset Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should apply Restaurant 5% preset', async ({ page }) => {
    const presetBtn = page.locator('.preset-btn:has-text("Restaurant 5%")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(500);

      const selectedRate = await page.locator('#gstRateDropdown').inputValue();
      expect(selectedRate).toBe('5');
    }
  });

  test('should apply Services 18% preset', async ({ page }) => {
    const presetBtn = page.locator('.preset-btn:has-text("Services 18%")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(500);

      const selectedRate = await page.locator('#gstRateDropdown').inputValue();
      expect(selectedRate).toBe('18');
    }
  });

  test('should apply Electronics 12% preset', async ({ page }) => {
    const presetBtn = page.locator('.preset-btn:has-text("Electronics 12%")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(500);

      const selectedRate = await page.locator('#gstRateDropdown').inputValue();
      expect(selectedRate).toBe('12');
    }
  });

  test('should apply Luxury 28% preset', async ({ page }) => {
    const presetBtn = page.locator('.preset-btn:has-text("Luxury 28%")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(500);

      const selectedRate = await page.locator('#gstRateDropdown').inputValue();
      expect(selectedRate).toBe('28');
    }
  });
});

test.describe('GST Calculator - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should handle decimal amounts (₹99.99)', async ({ page }) => {
    await page.fill('#amount', '99.99');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // GST = 99.99 × 0.18 = 17.9982 ≈ 18.00
    expect(parseIndianCurrency(totalGst!)).toBeCloseTo(18, 1);
    expect(parseIndianCurrency(totalAmount!)).toBeCloseTo(117.99, 1);
  });

  test('should handle large amounts (₹1 crore)', async ({ page }) => {
    const oneCrore = 10000000;
    await page.fill('#amount', oneCrore.toString());
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // GST = 1,00,00,000 × 0.18 = 18,00,000
    expect(parseIndianCurrency(totalGst!)).toBe(1800000);
    expect(parseIndianCurrency(totalAmount!)).toBe(11800000);
  });

  test('should handle small amounts (₹1)', async ({ page }) => {
    await page.fill('#amount', '1');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // GST = 1 × 0.18 = 0.18
    expect(parseIndianCurrency(totalGst!)).toBeCloseTo(0.18, 2);
    expect(parseIndianCurrency(totalAmount!)).toBeCloseTo(1.18, 2);
  });

  test('should handle zero amount', async ({ page }) => {
    await page.fill('#amount', '0');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    expect(parseIndianCurrency(totalGst!)).toBe(0);
    expect(parseIndianCurrency(totalAmount!)).toBe(0);
  });

  test('should handle empty input gracefully', async ({ page }) => {
    await page.fill('#amount', '');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    expect(totalGst).toBeTruthy(); // Should not crash
  });

  test('should handle negative amounts (if applicable)', async ({ page }) => {
    await page.fill('#amount', '-1000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    // Should either reject or handle gracefully
    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(totalAmount).toBeTruthy();
  });
});

test.describe('GST Calculator - Indian Number Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should format ₹1 lakh as ₹1,00,000 not ₹100,000', async ({ page }) => {
    await page.fill('#amount', '100000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalAmount = await page.locator('#totalAmount').textContent();
    
    // Should have Indian formatting
    expect(totalAmount).toContain('₹');
    expect(totalAmount).toMatch(/1,18,000/); // Indian format
  });

  test('should format ₹10 lakh correctly', async ({ page }) => {
    await page.fill('#amount', '1000000');
    await page.selectOption('#gstRateDropdown', '5');
    await page.waitForTimeout(500);

    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(totalAmount).toMatch(/10,50,000/); // Indian format
  });

  test('should show rupee symbol (₹) in all amounts', async ({ page }) => {
    await page.fill('#amount', '5000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const originalAmount = await page.locator('#originalAmount').textContent();
    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    expect(originalAmount).toContain('₹');
    expect(totalGst).toContain('₹');
    expect(totalAmount).toContain('₹');
  });
});

test.describe('GST Calculator - Real-World Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Scenario: Restaurant bill (₹2,500 + 5% GST)', async ({ page }) => {
    await page.fill('#amount', '2500');
    await page.selectOption('#gstRateDropdown', '5');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Expected: ₹125 GST, ₹2,625 total
    expect(parseIndianCurrency(totalGst!)).toBe(125);
    expect(parseIndianCurrency(totalAmount!)).toBe(2625);
  });

  test('Scenario: iPhone purchase (₹79,900 + 18% GST)', async ({ page }) => {
    await page.fill('#amount', '79900');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Expected: ₹14,382 GST, ₹94,282 total
    expect(parseIndianCurrency(totalGst!)).toBe(14382);
    expect(parseIndianCurrency(totalAmount!)).toBe(94282);
  });

  test('Scenario: Car purchase (₹5,00,000 + 28% GST)', async ({ page }) => {
    await page.fill('#amount', '500000');
    await page.selectOption('#gstRateDropdown', '28');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Expected: ₹1,40,000 GST, ₹6,40,000 total
    expect(parseIndianCurrency(totalGst!)).toBe(140000);
    expect(parseIndianCurrency(totalAmount!)).toBe(640000);
  });

  test('Scenario: Consulting services (₹50,000 + 18% GST)', async ({ page }) => {
    await page.fill('#amount', '50000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Expected: ₹9,000 GST, ₹59,000 total
    expect(parseIndianCurrency(totalGst!)).toBe(9000);
    expect(parseIndianCurrency(totalAmount!)).toBe(59000);
  });

  test('Scenario: Gold purchase (₹2,00,000 + 3% GST)', async ({ page }) => {
    await page.fill('#amount', '200000');
    await page.selectOption('#gstRateDropdown', '3');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    // Expected: ₹6,000 GST, ₹2,06,000 total
    expect(parseIndianCurrency(totalGst!)).toBe(6000);
    expect(parseIndianCurrency(totalAmount!)).toBe(206000);
  });
});

test.describe('GST Calculator - Mode Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should switch between Simple and Advanced modes', async ({ page }) => {
    // Default should be Simple mode
    const advancedBtn = page.locator('.advanced-mode-btn');
    await advancedBtn.click();
    await page.waitForTimeout(500);

    // Check if advanced features are visible
    const rateButtons = page.locator('.rate-btn');
    if (await rateButtons.first().isVisible()) {
      expect(await rateButtons.count()).toBeGreaterThan(0);
    }

    // Switch back to Simple mode
    const simpleBtn = page.locator('.simple-mode-btn');
    await simpleBtn.click();
    await page.waitForTimeout(500);

    // Check if simple dropdown is visible
    await expect(page.locator('#gstRateDropdown')).toBeVisible();
  });

  test('should retain calculation when switching modes', async ({ page }) => {
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const originalTotal = await page.locator('#totalAmount').textContent();

    // Switch to Advanced mode
    await page.click('.advanced-mode-btn');
    await page.waitForTimeout(500);

    // Switch back to Simple mode
    await page.click('.simple-mode-btn');
    await page.waitForTimeout(500);

    const newTotal = await page.locator('#totalAmount').textContent();
    expect(newTotal).toBe(originalTotal);
  });
});

test.describe('GST Calculator - Reset Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should reset all fields when reset button is clicked', async ({ page }) => {
    // Fill in values
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    // Click reset button
    const resetBtn = page.locator('button:has-text("Reset"), button:has-text("Clear")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(500);

      // Verify fields are cleared
      const amountValue = await page.locator('#amount').inputValue();
      expect(amountValue).toBe('');
    }
  });
});

test.describe('GST Calculator - Real-Time Calculation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should calculate automatically without button click', async ({ page }) => {
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    
    // Wait briefly for auto-calculation
    await page.waitForTimeout(500);

    // Should see results immediately
    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(parseIndianCurrency(totalAmount!)).toBe(11800);
  });

  test('should update calculation when amount changes', async ({ page }) => {
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    // Change amount
    await page.fill('#amount', '20000');
    await page.waitForTimeout(500);

    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(parseIndianCurrency(totalAmount!)).toBe(23600);
  });

  test('should update calculation when GST rate changes', async ({ page }) => {
    await page.fill('#amount', '10000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    // Change GST rate
    await page.selectOption('#gstRateDropdown', '5');
    await page.waitForTimeout(500);

    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(parseIndianCurrency(totalAmount!)).toBe(10500);
  });
});

test.describe('GST Calculator - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to iPhone SE size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should display mobile layout correctly', async ({ page }) => {
    // Check if mobile-specific elements are visible
    await expect(page.locator('body')).toBeVisible();
    
    // Main input should be visible and usable on mobile
    await expect(page.locator('#amount')).toBeVisible();
    
    // Should be able to interact with dropdown on mobile
    await expect(page.locator('#gstRateDropdown')).toBeVisible();
  });

  test('should calculate GST correctly on mobile', async ({ page }) => {
    await page.fill('#amount', '5000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const totalAmount = await page.locator('#totalAmount').textContent();
    expect(parseIndianCurrency(totalAmount!)).toBe(5900);
  });

  test('should handle mobile inputs if separate mobile fields exist', async ({ page }) => {
    const mobileAmount = page.locator('#mobileAmount');
    
    if (await mobileAmount.isVisible()) {
      await mobileAmount.fill('3000');
      await page.waitForTimeout(500);

      const mobileTotal = await page.locator('#mobileTotal').textContent();
      expect(mobileTotal).toBeTruthy();
    }
  });

  test('should allow scrolling on mobile', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Should not crash and should still be functional
    const amount = await page.locator('#amount');
    await expect(amount).toBeVisible();
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    const exclusiveBtn = page.locator('.type-btn:has-text("GST Exclusive")');
    await exclusiveBtn.tap();
    await page.waitForTimeout(500);

    await expect(exclusiveBtn).toHaveClass(/active/);
  });
});

test.describe('GST Calculator - Competitive Feature Parity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should match TaxAdda calculator accuracy', async ({ page }) => {
    // Test case from TaxAdda
    await page.fill('#amount', '15000');
    await page.selectOption('#gstRateDropdown', '12');
    await page.waitForTimeout(500);

    const totalGst = await page.locator('#totalGst').textContent();
    const totalAmount = await page.locator('#totalAmount').textContent();

    expect(parseIndianCurrency(totalGst!)).toBe(1800);
    expect(parseIndianCurrency(totalAmount!)).toBe(16800);
  });

  test('should match ClearTax reverse calculation', async ({ page }) => {
    await page.click('.type-btn:has-text("GST Inclusive")');
    await page.fill('#amount', '29900');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    const originalAmount = await page.locator('#originalAmount').textContent();
    // Original should be approximately 25338.98
    expect(parseIndianCurrency(originalAmount!)).toBeCloseTo(25338.98, 0);
  });

  test('should provide detailed breakdown like TallySolutions', async ({ page }) => {
    await page.fill('#amount', '50000');
    await page.selectOption('#gstRateDropdown', '18');
    await page.waitForTimeout(500);

    // Should show CGST, SGST, and Total
    await expect(page.locator('#cgstAmount')).toBeVisible();
    await expect(page.locator('#sgstAmount')).toBeVisible();
    await expect(page.locator('#totalGst')).toBeVisible();
    await expect(page.locator('#totalAmount')).toBeVisible();
  });
});

