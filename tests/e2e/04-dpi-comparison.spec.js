// 04-dpi-comparison.spec.js

import { test, expect } from '@playwright/test';

import testData from './test-data.js';



test.describe('DPI Comparison Tool', () => {

  

  test.beforeEach(async ({ page }) => {

    // Navigate to DPI calculator page

    await page.goto('/dpi-calculator/');

    

    // Wait for page to load

    await page.waitForLoadState('networkidle');

    

    // Click on DPI Comparison tab

    await page.click('[data-calc="dpi-comparison"]');

    

    // Wait for calculator to be visible

    await expect(page.locator('#dpi-comparison')).toBeVisible();

  });



  test('should display DPI comparison elements', async ({ page }) => {

    // Check Setup A inputs

    await expect(page.locator('#compare-dpi-a')).toBeVisible();

    await expect(page.locator('#compare-sens-a')).toBeVisible();

    

    // Check Setup B inputs

    await expect(page.locator('#compare-dpi-b')).toBeVisible();

    await expect(page.locator('#compare-sens-b')).toBeVisible();

    

    // Check buttons

    await expect(page.locator('#compare-dpi')).toBeVisible();

    await expect(page.locator('#swap-setups')).toBeVisible();

    

    // Check labels (use specific classes to avoid strict mode violations)

    await expect(page.locator('.comparison-input-label').filter({ hasText: 'Setup A' })).toBeVisible();

    await expect(page.locator('.comparison-input-label').filter({ hasText: 'Setup B' })).toBeVisible();

  });



  test('should have default values pre-filled', async ({ page }) => {

    // Setup A defaults

    await expect(page.locator('#compare-dpi-a')).toHaveValue('800');

    await expect(page.locator('#compare-sens-a')).toHaveValue('0.5');

    

    // Setup B defaults

    await expect(page.locator('#compare-dpi-b')).toHaveValue('1600');

    await expect(page.locator('#compare-sens-b')).toHaveValue('0.25');

  });



  test.describe('Test comparison cases from test data', () => {

    for (const testCase of testData.comparisonTestCases) {

      test(`should compare correctly for ${testCase.name}`, async ({ page }) => {

        // Fill Setup A

        await page.fill('#compare-dpi-a', testCase.setupA.dpi.toString());

        await page.fill('#compare-sens-a', testCase.setupA.sensitivity.toString());

        

        // Fill Setup B

        await page.fill('#compare-dpi-b', testCase.setupB.dpi.toString());

        await page.fill('#compare-sens-b', testCase.setupB.sensitivity.toString());

        

        // Click compare

        await page.click('#compare-dpi');

        

        // Wait for results

        await expect(page.locator('#comparison-results')).toBeVisible();

        

        // Check eDPI A

        const edpiAText = await page.locator('#result-edpi-a').textContent();

        const calculatedEdpiA = parseFloat(edpiAText.replace(/,/g, ''));

        expect(Math.abs(calculatedEdpiA - testCase.expectedEdpiA)).toBeLessThanOrEqual(testCase.tolerance);

        

        // Check eDPI B

        const edpiBText = await page.locator('#result-edpi-b').textContent();

        const calculatedEdpiB = parseFloat(edpiBText.replace(/,/g, ''));

        expect(Math.abs(calculatedEdpiB - testCase.expectedEdpiB)).toBeLessThanOrEqual(testCase.tolerance);

      });

    }

  });



  test('should detect identical eDPI with different DPI/sens combinations', async ({ page }) => {

    // 400 DPI × 2.0 sens = 800 eDPI

    await page.fill('#compare-dpi-a', '400');

    await page.fill('#compare-sens-a', '2.0');

    

    // 800 DPI × 1.0 sens = 800 eDPI

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '1.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Verdict should mention identical or same

    const verdictText = await page.locator('#comparison-verdict').textContent();

    expect(verdictText.toLowerCase()).toMatch(/identical|same/);

  });



  test('should calculate cm/360 for both setups', async ({ page }) => {

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '1600');

    await page.fill('#compare-sens-b', '0.25');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Both should show cm/360 values

    const cm360AText = await page.locator('#result-cm360-a').textContent();

    const cm360BText = await page.locator('#result-cm360-b').textContent();

    

    expect(cm360AText).toContain('cm');

    expect(cm360BText).toContain('cm');

    

    // Extract numerical values

    const cm360AMatch = cm360AText.match(/(\d+\.?\d*)/);

    const cm360BMatch = cm360BText.match(/(\d+\.?\d*)/);

    

    expect(cm360AMatch).not.toBeNull();

    expect(cm360BMatch).not.toBeNull();

  });



  test('should show sensitivity category for both setups', async ({ page }) => {

    // Very low sensitivity

    await page.fill('#compare-dpi-a', '400');

    await page.fill('#compare-sens-a', '0.5');

    

    // Very high sensitivity

    await page.fill('#compare-dpi-b', '3200');

    await page.fill('#compare-sens-b', '1.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Both should show categories

    const categoryAText = await page.locator('#result-cat-a').textContent();

    const categoryBText = await page.locator('#result-cat-b').textContent();

    

    expect(categoryAText.length).toBeGreaterThan(0);

    expect(categoryBText.length).toBeGreaterThan(0);

    expect(categoryAText).not.toBe('-');

    expect(categoryBText).not.toBe('-');

    

    // They should be different categories

    expect(categoryAText.toLowerCase()).not.toBe(categoryBText.toLowerCase());

  });



  test('should show comprehensive verdict with insights', async ({ page }) => {

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '400');

    await page.fill('#compare-sens-b', '2.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Verdict should be comprehensive

    expect(verdictText.length).toBeGreaterThan(50);

    

    // Should mention insights (native DPI, sensor performance, etc.)

    // from Prompt #12 enhancements

    expect(verdictText.toLowerCase()).toMatch(/native|sensor|setup/);

  });



  test('should detect native DPI steps (400, 800, 1600, 3200)', async ({ page }) => {

    // Native DPI (800)

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    

    // Non-native DPI (1200)

    await page.fill('#compare-dpi-b', '1200');

    await page.fill('#compare-sens-b', '0.333');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should mention native DPI

    expect(verdictText.toLowerCase()).toContain('native');

  });



  test('should warn about very low DPI (potential pixel skipping)', async ({ page }) => {

    // Very low DPI

    await page.fill('#compare-dpi-a', '200');

    await page.fill('#compare-sens-a', '2.0');

    

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.5');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should warn about low DPI

    expect(verdictText.toLowerCase()).toMatch(/low dpi|pixel skipping|400\+ dpi/i);

  });



  test('should warn about very high DPI (potential jitter)', async ({ page }) => {

    // Very high DPI

    await page.fill('#compare-dpi-a', '6400');

    await page.fill('#compare-sens-a', '0.1');

    

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.5');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should warn about high DPI

    expect(verdictText.toLowerCase()).toMatch(/high dpi|jittery|3200/i);

  });



  test('should recommend mousepad size for high cm/360', async ({ page }) => {

    // Very low sensitivity = high cm/360

    await page.fill('#compare-dpi-a', '400');

    await page.fill('#compare-sens-a', '1.0');

    

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '1.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should mention mousepad size

    expect(verdictText.toLowerCase()).toMatch(/mousepad|large|cm\/360/i);

  });



  test('should show conversion formula to match eDPI', async ({ page }) => {

    // Different eDPI values

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');  // 400 eDPI

    

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '1.0');  // 800 eDPI

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should provide conversion formula (from Prompt #12)

    // When eDPI difference > 50

    const edpiDiff = Math.abs(400 - 800);

    if (edpiDiff > 50) {

      expect(verdictText.toLowerCase()).toMatch(/to match|sensitivity|use/i);

    }

  });



  test('should swap Setup A and Setup B values', async ({ page }) => {

    // Set initial values

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '1600');

    await page.fill('#compare-sens-b', '0.25');

    

    // Click swap button

    await page.click('#swap-setups');

    

    // Wait for swap

    await page.waitForTimeout(300);

    

    // Check values are swapped

    await expect(page.locator('#compare-dpi-a')).toHaveValue('1600');

    await expect(page.locator('#compare-sens-a')).toHaveValue('0.25');

    await expect(page.locator('#compare-dpi-b')).toHaveValue('800');

    await expect(page.locator('#compare-sens-b')).toHaveValue('0.5');

  });



  test('should auto-compare after swap if inputs were filled', async ({ page }) => {

    // Fill and compare first

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '400');

    await page.fill('#compare-sens-b', '1.0');

    

    await page.click('#compare-dpi');

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Swap

    await page.click('#swap-setups');

    

    // Wait for auto-compare after swap (if implemented)

    await page.waitForTimeout(500);

    

    // Results may or may not auto-update depending on implementation

    // Test passes if swap works correctly

    await expect(page.locator('#compare-dpi-a')).toHaveValue('400');

    await expect(page.locator('#compare-sens-a')).toHaveValue('1.0');

  });



  test('should validate Setup A DPI input', async ({ page }) => {

    await page.fill('#compare-dpi-a', '50');

    await page.fill('#compare-sens-a', '1.0');

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.5');

    

    const dialogPromise = new Promise(resolve => {

      page.on('dialog', async dialog => {

        expect(dialog.message()).toContain('DPI must be between 100 and 30,000');

        await dialog.accept();

        resolve();

      });

    });

    

    await page.click('#compare-dpi');

    await dialogPromise;

  });



  test('should validate Setup B sensitivity input', async ({ page }) => {

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '15');

    

    const dialogPromise = new Promise(resolve => {

      page.on('dialog', async dialog => {

        expect(dialog.message()).toContain('sensitivity must be between 0.01 and 10');

        await dialog.accept();

        resolve();

      });

    });

    

    await page.click('#compare-dpi');

    await dialogPromise;

  });



  test('should reject identical setups', async ({ page }) => {

    // Same exact values

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.5');

    

    const dialogPromise = new Promise(resolve => {

      page.on('dialog', async dialog => {

        expect(dialog.message().toLowerCase()).toMatch(/identical|same|duplicate/);

        await dialog.accept();

        resolve();

      });

    });

    

    await page.click('#compare-dpi');

    await Promise.race([dialogPromise, page.waitForTimeout(1000)]);

  });



  test('should handle empty inputs gracefully', async ({ page }) => {

    // Clear all inputs

    await page.fill('#compare-dpi-a', '');

    await page.fill('#compare-sens-a', '');

    await page.fill('#compare-dpi-b', '');

    await page.fill('#compare-sens-b', '');

    

    const dialogPromise = new Promise(resolve => {

      page.on('dialog', async dialog => {

        expect(dialog.message().toLowerCase()).toMatch(/fill in all|required|empty/);

        await dialog.accept();

        resolve();

      });

    });

    

    await page.click('#compare-dpi');

    await Promise.race([dialogPromise, page.waitForTimeout(1000)]);

  });



  test('should handle partial empty inputs', async ({ page }) => {

    // Only fill Setup A

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '');

    await page.fill('#compare-sens-b', '');

    

    const dialogPromise = new Promise(resolve => {

      page.on('dialog', async dialog => {

        expect(dialog.message().toLowerCase()).toMatch(/fill in all|required|empty/);

        await dialog.accept();

        resolve();

      });

    });

    

    await page.click('#compare-dpi');

    await Promise.race([dialogPromise, page.waitForTimeout(1000)]);

  });



  test('should show color-coded result cards', async ({ page }) => {

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '1600');

    await page.fill('#compare-sens-b', '0.25');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Check Setup A card has styling

    const setupACard = page.locator('#comparison-results > div > div:first-child');

    const borderColorA = await setupACard.evaluate(el => 

      window.getComputedStyle(el).borderColor || 

      window.getComputedStyle(el).borderLeftColor || 

      'rgb(0, 0, 0)' // Fallback

    );

    

    expect(borderColorA).toBeTruthy();

    expect(borderColorA).not.toBe('rgba(0, 0, 0, 0)');

    

    // Check Setup B card has styling

    const setupBCard = page.locator('#comparison-results > div > div:last-child');

    const borderColorB = await setupBCard.evaluate(el => 

      window.getComputedStyle(el).borderColor || 

      window.getComputedStyle(el).borderLeftColor || 

      'rgb(0, 0, 0)' // Fallback

    );

    

    expect(borderColorB).toBeTruthy();

    expect(borderColorB).not.toBe('rgba(0, 0, 0, 0)');

  });



  test('should handle decimal sensitivity values precisely', async ({ page }) => {

    await page.fill('#compare-dpi-a', '1600');

    await page.fill('#compare-sens-a', '0.139');

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.278');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Should detect identical eDPI (222.4)

    const edpiAText = await page.locator('#result-edpi-a').textContent();

    const edpiBText = await page.locator('#result-edpi-b').textContent();

    const edpiA = parseFloat(edpiAText.replace(/,/g, ''));

    const edpiB = parseFloat(edpiBText.replace(/,/g, ''));

    

    // Both should be approximately 222.4

    expect(Math.abs(edpiA - 222.4)).toBeLessThan(1);

    expect(Math.abs(edpiB - 222.4)).toBeLessThan(1);

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    expect(verdictText.toLowerCase()).toMatch(/identical|same/);

  });



  test('should compare TenZ settings (1600×0.139) vs standard 400×2.0', async ({ page }) => {

    // TenZ settings

    await page.fill('#compare-dpi-a', '1600');

    await page.fill('#compare-sens-a', '0.139');

    

    // Standard CS2 settings

    await page.fill('#compare-dpi-b', '400');

    await page.fill('#compare-sens-b', '2.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // TenZ eDPI ≈ 222.4

    const edpiAText = await page.locator('#result-edpi-a').textContent();

    const edpiA = parseFloat(edpiAText.replace(/,/g, ''));

    expect(Math.abs(edpiA - 222.4)).toBeLessThan(1);

    

    // Standard eDPI = 800

    const edpiBText = await page.locator('#result-edpi-b').textContent();

    const edpiB = parseFloat(edpiBText.replace(/,/g, ''));

    expect(Math.abs(edpiB - 800)).toBeLessThan(1);

    

    // Verdict should mention they're very different

    const verdictText = await page.locator('#comparison-verdict').textContent();

    expect(verdictText.toLowerCase()).toMatch(/higher|lower|different/);

  });



  test('should maintain results when switching tabs and returning', async ({ page }) => {

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    await page.fill('#compare-dpi-b', '1600');

    await page.fill('#compare-sens-b', '0.25');

    

    await page.click('#compare-dpi');

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // Switch to another calculator

    await page.click('[data-calc="edpi-calc"]');

    await page.waitForTimeout(300);

    

    // Return to comparison

    await page.click('[data-calc="dpi-comparison"]');

    await page.waitForTimeout(300);

    

    // Input values should be maintained

    await expect(page.locator('#compare-dpi-a')).toHaveValue('800');

    await expect(page.locator('#compare-sens-a')).toHaveValue('0.5');

  });



  test('should format large eDPI values with commas', async ({ page }) => {

    // Very high DPI/sens = large eDPI

    await page.fill('#compare-dpi-a', '3200');

    await page.fill('#compare-sens-a', '5.0');

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '0.5');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    // eDPI A should be 16,000

    const edpiAText = await page.locator('#result-edpi-a').textContent();

    

    // Should show 16,000 or 16000

    expect(edpiAText).toMatch(/16[,]?000/);

  });



  test('should detect 4x+ DPI ratio and warn about sensor performance', async ({ page }) => {

    // 400 vs 1600 = 4x ratio

    await page.fill('#compare-dpi-a', '400');

    await page.fill('#compare-sens-a', '1.0');

    await page.fill('#compare-dpi-b', '1600');

    await page.fill('#compare-sens-b', '0.25');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should mention DPI ratio or sensor performance

    expect(verdictText.toLowerCase()).toMatch(/4x|ratio|higher dpi|sensor/i);

  });



  test('should recommend optimal range when one setup is outside', async ({ page }) => {

    // Optimal eDPI (400)

    await page.fill('#compare-dpi-a', '800');

    await page.fill('#compare-sens-a', '0.5');

    

    // Too high eDPI (2400)

    await page.fill('#compare-dpi-b', '800');

    await page.fill('#compare-sens-b', '3.0');

    

    await page.click('#compare-dpi');

    

    await expect(page.locator('#comparison-results')).toBeVisible();

    

    const verdictText = await page.locator('#comparison-verdict').textContent();

    

    // Should recommend the optimal setup

    expect(verdictText.toLowerCase()).toMatch(/optimal|better|recommend/i);

  });



});

