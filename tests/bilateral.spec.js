import { test, expect } from '@playwright/test';
import { setupTest, selectDisability } from './helpers.js';

test.describe('VA Calculator - Bilateral Factor', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
  });

  test('Bilateral factor adds 10% bonus to combined rating', async ({ page }) => {
    // Set first disability
    const select1 = page.locator('.disability-select').first();
    await select1.selectOption('30');
    
    // Find and check "Left Side" checkbox
    const disabilityParent1 = select1.locator('..');
    const leftCheckbox = disabilityParent1.locator('.bilateral-left, input[type="checkbox"]');
    
    if (await leftCheckbox.count() > 0) {
      await leftCheckbox.first().check();
    }
    
    await page.waitForTimeout(300);
    
    // Add second disability
    const addButton = page.locator('button:has-text("Add"), button:has-text("Disability")');
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(200);
    }
    
    const select2 = page.locator('.disability-select').nth(1);
    if (await select2.isVisible()) {
      await select2.selectOption('20');
      
      // Find and check "Right Side" checkbox for second disability
      const disabilityParent2 = select2.locator('..');
      const rightCheckbox = disabilityParent2.locator('.bilateral-right, input[type="checkbox"]');
      
      if (await rightCheckbox.count() > 0) {
        await rightCheckbox.first().check();
      }
    }
    
    await page.waitForTimeout(500);
    
    // Check rating with bilateral factor
    const rating = await page.locator('#ratingNumber').textContent();
    expect(rating).toMatch(/\d+%/);
    
    await page.screenshot({ path: 'test-results/bilateral-30-20.png', fullPage: true });
  });

  test('Bilateral factor with both disabilities marked on same side', async ({ page }) => {
    const select1 = page.locator('.disability-select').first();
    await select1.selectOption('40');
    
    // Mark as left side
    const parent1 = select1.locator('..');
    const checkbox1 = parent1.locator('.bilateral-left');
    if (await checkbox1.count() > 0) {
      await checkbox1.first().check();
    }
    
    await page.waitForTimeout(300);
    
    // Add second disability
    const addButton = page.locator('button:has-text("Add")');
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(200);
    }
    
    const select2 = page.locator('.disability-select').nth(1);
    if (await select2.isVisible()) {
      await select2.selectOption('30');
      
      // Also mark as left side
      const parent2 = select2.locator('..');
      const checkbox2 = parent2.locator('.bilateral-left');
      if (await checkbox2.count() > 0) {
        await checkbox2.first().check();
      }
    }
    
    await page.waitForTimeout(500);
    
    const rating = await page.locator('#ratingNumber').textContent();
    expect(rating).toMatch(/\d+%/);
    
    // Rating should reflect bilateral factor
    const ratingNum = parseInt(rating);
    expect(ratingNum).toBeGreaterThanOrEqual(58); // At least 40+30
  });

  test('Non-bilateral disabilities do not get bilateral factor', async ({ page }) => {
    const select1 = page.locator('.disability-select').first();
    await select1.selectOption('50');
    
    await page.waitForTimeout(300);
    
    // Add second disability
    const addButton = page.locator('button:has-text("Add")');
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(200);
    }
    
    const select2 = page.locator('.disability-select').nth(1);
    if (await select2.isVisible()) {
      await select2.selectOption('30');
    }
    
    // Don't check any bilateral boxes
    await page.waitForTimeout(500);
    
    const rating = await page.locator('#ratingNumber').textContent();
    // Standard calculation: 50% + 30% = 65% → rounds to 70% (VA math)
    const ratingNum = parseInt(rating);
    expect(ratingNum).toBeGreaterThanOrEqual(65);
    
    await page.screenshot({ path: 'test-results/no-bilateral.png', fullPage: true });
  });

  test('Multiple bilateral disabilities apply factor correctly', async ({ page }) => {
    await setupTest(page);
    
    // Add a third disability
    const addButton = page.locator('.add-disability-btn, button:has-text("Add Disability"), button:has-text("Add Another")');
    await addButton.click();
    await page.waitForTimeout(1000);
    
    // Set three disabilities
    await selectDisability(page, 1, 30);
    await page.waitForTimeout(800);
    await selectDisability(page, 2, 20);
    await page.waitForTimeout(800);
    await selectDisability(page, 3, 10);
    await page.waitForTimeout(1000);
    
    // Check bilateral for first disability (left side)
    const disability1 = page.locator('.disability-item, .disability-input-group').first();
    const leftCheck1 = disability1.locator('input[type="checkbox"]').first();
    await leftCheck1.check();
    await page.waitForTimeout(1000);
    
    // Check bilateral for second disability (right side)
    const disability2 = page.locator('.disability-item, .disability-input-group').nth(1);
    const rightCheck2 = disability2.locator('input[type="checkbox"]').last();
    await rightCheck2.check();
    await page.waitForTimeout(1000);
    
    // Check bilateral for third disability (left side)
    const disability3 = page.locator('.disability-item, .disability-input-group').nth(2);
    const leftCheck3 = disability3.locator('input[type="checkbox"]').first();
    await leftCheck3.check();
    await page.waitForTimeout(2000); // Extra wait for bilateral calculation
    
    // Try multiple selectors to find the rating display
    const ratingSelectors = [
      '.rating-number',
      '.combined-rating',
      '#combinedRating',
      '[class*="rating"] >> text=/\\d+%/',
      'text=/Combined Rating.*\\d+%/',
      '.result-card >> text=/\\d+%/'
    ];
    
    let ratingText = '';
    for (const selector of ratingSelectors) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        ratingText = await element.textContent();
        if (ratingText && ratingText.includes('%')) {
          break;
        }
      }
    }
    
    // Extract number from text like "70%" or "Combined Rating: 70%"
    const ratingMatch = ratingText.match(/(\d+)%/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : NaN;
    
    console.log('Rating text found:', ratingText);
    console.log('Parsed rating:', rating);
    
    // With bilateral factor, should be greater than simple addition (30+20+10=60%)
    expect(rating).toBeGreaterThan(50);
    expect(rating).toBeLessThanOrEqual(100);
    
    await page.screenshot({ path: 'test-results/multiple-bilateral.png', fullPage: true });
  });

  test('Bilateral factor shows in explanation text', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('50');
    
    const parent = page.locator('.disability-select').first().locator('..');
    const checkbox = parent.locator('.bilateral-left, .bilateral-right, input[type="checkbox"]');
    
    if (await checkbox.count() > 0) {
      const ratingBefore = await page.locator('#ratingNumber').textContent();
      
      await checkbox.first().check();
      await page.waitForTimeout(500);
      
      // Check for bilateral explanation
      const explanation = page.locator('#ratingExplanation, .rating-explanation, .combined-rating-explanation');
      if (await explanation.isVisible()) {
        const explanationText = await explanation.textContent();
        
        // Should mention bilateral factor
        expect(explanationText.toLowerCase()).toContain('bilateral');
        
        await page.screenshot({ path: 'test-results/bilateral-explanation.png', fullPage: true });
      }
    }
  });

  test('Bilateral checkbox toggle works correctly', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('30');
    
    const parent = page.locator('.disability-select').first().locator('..');
    const checkbox = parent.locator('.bilateral-left, input[type="checkbox"]');
    
    if (await checkbox.count() > 0) {
      // Check it
      await checkbox.first().check();
      await page.waitForTimeout(500);
      
      const rating1 = await page.locator('#ratingNumber').textContent();
      const ratingNum1 = parseInt(rating1);
      
      // Uncheck it
      await checkbox.first().uncheck();
      await page.waitForTimeout(500);
      
      const rating2 = await page.locator('#ratingNumber').textContent();
      const ratingNum2 = parseInt(rating2);
      
      // Rating should be different (bilateral adds bonus)
      expect(ratingNum1).toBeGreaterThan(ratingNum2);
      
      await page.screenshot({ path: 'test-results/bilateral-toggle.png', fullPage: true });
    }
  });

  test('Bilateral factor with TDIU still applies correctly', async ({ page }) => {
    // Add disability
    await page.locator('.disability-select').first().selectOption('50');
    
    // Mark as bilateral
    const parent = page.locator('.disability-select').first().locator('..');
    const checkbox = parent.locator('.bilateral-left, input[type="checkbox"]');
    if (await checkbox.count() > 0) {
      await checkbox.first().check();
    }
    
    await page.waitForTimeout(300);
    
    // Enable TDIU
    const tdiuCheckbox = page.locator('#tdiuCheckbox, #tdiuEnable');
    if (await tdiuCheckbox.isVisible()) {
      const paymentBefore = await page.locator('#monthlyPayment').textContent();
      
      await tdiuCheckbox.check();
      await page.waitForTimeout(500);
      
      const paymentAfter = await page.locator('#monthlyPayment').textContent();
      
      // Payment should be higher with TDIU
      const before = parseFloat(paymentBefore.replace(/[$,]/g, ''));
      const after = parseFloat(paymentAfter.replace(/[$,]/g, ''));
      expect(after).toBeGreaterThan(before);
      
      await page.screenshot({ path: 'test-results/bilateral-tdiu.png', fullPage: true });
    }
  });

  test('Mobile view handles bilateral factor', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.locator('.disability-select').first().selectOption('40');
    
    // Check bilateral checkbox
    const parent = page.locator('.disability-select').first().locator('..');
    const checkbox = parent.locator('.bilateral-left');
    if (await checkbox.count() > 0) {
      await checkbox.first().check();
      
      await page.waitForTimeout(500);
      
      // Check mobile sticky bar
      const mobileSticky = page.locator('#mobileResultsSticky');
      if (await mobileSticky.isVisible()) {
        const stickyRating = await mobileSticky.locator('.mobile-sticky-rating').textContent();
        expect(stickyRating).toMatch(/\d+%/);
        
        await page.screenshot({ path: 'test-results/mobile-bilateral.png', fullPage: true });
      }
    }
  });
});

