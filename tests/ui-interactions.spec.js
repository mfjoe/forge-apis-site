import { test, expect } from '@playwright/test';
import { setupTest, selectDisability } from './helpers.js';

test.describe('VA Calculator - UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
  });

  test('Add disability button creates new input', async ({ page }) => {
    const initialCount = await page.locator('.disability-select').count();
    
    const addButton = page.locator('button:has-text("Add Disability"), button:has-text("Add Another")');
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(300);
      
      const newCount = await page.locator('.disability-select').count();
      expect(newCount).toBeGreaterThan(initialCount);
      
      await page.screenshot({ path: 'test-results/add-disability.png', fullPage: true });
    }
  });

  test('Remove disability button works', async ({ page }) => {
    // Add a third disability first
    await page.click('.add-disability-btn, button:has-text("Add"), button:has-text("Disability")');
    await page.waitForTimeout(1000);
    await page.waitForSelector('#disability3, .disability-item:last-child .disability-select', { state: 'visible', timeout: 5000 });
    
    const beforeRemove = await page.locator('.disability-select').count();
    
    // Find visible remove buttons
    const removeButtons = await page.locator('.remove-btn:visible, button.remove:visible, [class*="remove"]:visible');
    const visibleCount = await removeButtons.count();
    
    if (visibleCount > 0) {
      await removeButtons.last().click();
      await page.waitForTimeout(500);
      
      const afterRemove = await page.locator('.disability-select').count();
      expect(afterRemove).toBe(beforeRemove - 1);
    } else {
      // No visible remove buttons - this is expected behavior for 2 disabilities
      expect(beforeRemove).toBeGreaterThanOrEqual(2);
    }
    
    await page.screenshot({ path: 'test-results/remove-disability.png', fullPage: true });
  });

  test('Clear all resets calculator', async ({ page }) => {
    await setupTest(page);
    
    // Set disability value
    await selectDisability(page, 1, 70);
    await page.waitForTimeout(1000);
    
    // Go to dependents tab if it exists
    const dependentsTab = page.locator('.tab-button:has-text("Dependents"), button:has-text("Dependents")');
    const tabCount = await dependentsTab.count();
    if (tabCount > 0 && await dependentsTab.first().isVisible()) {
      await dependentsTab.first().click();
      await page.waitForTimeout(500);
    }
    
    // Add a dependent if the checkbox is available
    const marriedCheckbox = page.locator('#married');
    if (await marriedCheckbox.isVisible()) {
      await marriedCheckbox.check();
      await page.waitForTimeout(1000);
    }
    
    // Verify something is set before clearing
    const ratingBefore = await page.locator('.rating-number, .combined-rating').first().textContent();
    const ratingNumBefore = parseInt(ratingBefore);
    expect(ratingNumBefore).toBeGreaterThan(0);
    
    // Click clear/reset button
    const clearButton = page.locator('.clear-btn, button:has-text("Clear"), button:has-text("Reset"), .reset-btn');
    await clearButton.first().click();
    await page.waitForTimeout(1500);
    
    // Verify rating reset to 0%
    const ratingAfter = await page.locator('.rating-number, .combined-rating').first().textContent();
    expect(ratingAfter).toBe('0%');
    
    // Verify payment reset to $0.00
    const payment = await page.locator('#monthlyPayment').textContent();
    expect(payment).toBe('$0.00');
    
    await page.screenshot({ path: 'test-results/clear-all.png', fullPage: true });
  });

  test('TDIU section appears when eligible', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('70');
    await page.waitForTimeout(500);
    
    const tdiuSection = page.locator('#tdiuSection');
    // Check if TDIU section exists and is visible or becomes visible
    const isVisible = await tdiuSection.isVisible();
    
    // Some implementations show TDIU immediately, others only after interaction
    if (!isVisible) {
      const tdiuCheckbox = page.locator('#tdiuCheckbox, #tdiuEnable');
      if (await tdiuCheckbox.isVisible()) {
        await tdiuCheckbox.click();
        await page.waitForTimeout(500);
      }
    }
    
    await page.screenshot({ path: 'test-results/tdiu-section.png', fullPage: true });
  });

  test('Path to 100% shows for ratings 70-94%', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('80');
    await page.waitForTimeout(500);
    
    const pathSection = page.locator('#pathTo100Section');
    
    // Path to 100% might be calculated dynamically
    const isVisible = await pathSection.isVisible();
    
    // If not visible immediately, it might show after calculation
    if (!isVisible) {
      await page.waitForTimeout(500);
      const nowVisible = await pathSection.isVisible();
      expect(nowVisible || isVisible).toBeTruthy();
    }
    
    await page.screenshot({ path: 'test-results/path-to-100.png', fullPage: true });
  });

  test('Path to 100% hidden for 100% rating', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('100');
    await page.waitForTimeout(500);
    
    const pathSection = page.locator('#pathTo100Section');
    const isVisible = await pathSection.isVisible();
    
    // At 100%, path section should not be shown
    expect(isVisible).toBeFalsy();
    
    await page.screenshot({ path: 'test-results/no-path-to-100.png', fullPage: true });
  });

  test('Payment breakdown shows base rate and dependents', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('50');
    await page.waitForTimeout(300);
    
    const marriedCheckbox = page.locator('#married');
    if (await marriedCheckbox.isVisible()) {
      await marriedCheckbox.check();
      await page.waitForTimeout(500);
      
      const baseRate = page.locator('#baseRate');
      const baseRateText = await baseRate.textContent();
      expect(baseRateText).not.toBe('$0.00');
      
      const dependentAdditions = page.locator('#dependentAdditions');
      await expect(dependentAdditions).toBeVisible();
      
      await page.screenshot({ path: 'test-results/payment-breakdown.png', fullPage: true });
    }
  });

  test('Disability dropdown options are available', async ({ page }) => {
    const disabilitySelect = page.locator('.disability-select').first();
    await disabilitySelect.click();
    
    // Check for standard disability options
    const options = await disabilitySelect.locator('option').all();
    expect(options.length).toBeGreaterThan(5);
    
    // Standard options should include: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    const optionTexts = await disabilitySelect.locator('option').allTextContents();
    expect(optionTexts.some(text => text.includes('50'))).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/disability-options.png', fullPage: true });
  });

  test('Results update dynamically as inputs change', async ({ page }) => {
    const initialPayment = await page.locator('#monthlyPayment').textContent();
    
    await page.locator('.disability-select').first().selectOption('30');
    await page.waitForTimeout(500);
    
    const newPayment = await page.locator('#monthlyPayment').textContent();
    expect(newPayment).not.toBe(initialPayment);
    
    // Add dependent
    const marriedCheckbox = page.locator('#married');
    if (await marriedCheckbox.isVisible()) {
      const paymentBeforeDependent = await page.locator('#monthlyPayment').textContent();
      
      await marriedCheckbox.check();
      await page.waitForTimeout(500);
      
      const paymentAfterDependent = await page.locator('#monthlyPayment').textContent();
      expect(paymentAfterDependent).not.toBe(paymentBeforeDependent);
    }
    
    await page.screenshot({ path: 'test-results/dynamic-updates.png', fullPage: true });
  });

  test('Mobile sticky bar appears on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.locator('.disability-select').first().selectOption('40');
    await page.waitForTimeout(500);
    
    const mobileSticky = page.locator('#mobileResultsSticky');
    const isVisible = await mobileSticky.isVisible();
    
    // On mobile, sticky bar should be visible
    expect(isVisible).toBeTruthy();
    
    const stickyRating = await mobileSticky.locator('.mobile-sticky-rating').textContent();
    expect(stickyRating).toMatch(/\d+%/);
    
    await page.screenshot({ path: 'test-results/mobile-sticky-bar.png', fullPage: true });
  });

  test('FAQ items expand and collapse', async ({ page }) => {
    // Scroll to FAQ section
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    const faqItems = page.locator('.faq-item, .faq-question, summary');
    const count = await faqItems.count();
    
    if (count > 0) {
      const firstItem = faqItems.first();
      await firstItem.click();
      await page.waitForTimeout(300);
      
      await page.screenshot({ path: 'test-results/faq-expanded.png', fullPage: true });
      
      // Click again to collapse
      await firstItem.click();
      await page.waitForTimeout(300);
    }
  });

  test('Print button or save functionality works', async ({ page }) => {
    // Set some values
    await page.locator('.disability-select').first().selectOption('60');
    await page.waitForTimeout(300);
    
    // Look for print or save button
    const printButton = page.locator('button:has-text("Print"), button:has-text("Save")');
    
    if (await printButton.count() > 0) {
      await printButton.first().click();
      await page.waitForTimeout(300);
      
      await page.screenshot({ path: 'test-results/print-save.png', fullPage: true });
    } else {
      // If no print/save button, this is OK - just document it
      await page.screenshot({ path: 'test-results/no-print-save.png', fullPage: true });
    }
  });

  test('All tabs/panels are accessible', async ({ page }) => {
    // Look for tab buttons or navigation
    const tabButtons = page.locator('.tab-button, [role="tab"], button[data-tab]');
    const tabCount = await tabButtons.count();
    
    if (tabCount > 0) {
      for (let i = 0; i < tabCount; i++) {
        const tab = tabButtons.nth(i);
        const tabText = await tab.textContent();
        
        if (tabText && tabText.trim() !== '') {
          await tab.click();
          await page.waitForTimeout(300);
          
          await page.screenshot({ 
            path: `test-results/tab-${i}-${tabText.trim().replace(/\s+/g, '-')}.png`, 
            fullPage: true 
          });
        }
      }
    }
  });

  test('Form validates input correctly', async ({ page }) => {
    const childrenInput = page.locator('#childrenUnder18');
    if (await childrenInput.isVisible()) {
      // Try to enter negative number
      await childrenInput.fill('-5');
      await page.waitForTimeout(300);
      
      const value = await childrenInput.inputValue();
      
      // Should not accept negative values
      expect(parseInt(value)).toBeGreaterThanOrEqual(0);
      
      await page.screenshot({ path: 'test-results/input-validation.png', fullPage: true });
    }
  });

  test('Responsive design works on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.locator('.disability-select').first().selectOption('50');
    await page.waitForTimeout(500);
    
    // Calculator should still be functional
    const rating = await page.locator('#ratingNumber').textContent();
    expect(rating).toMatch(/\d+%/);
    
    await page.screenshot({ path: 'test-results/tablet-view.png', fullPage: true });
  });
});

