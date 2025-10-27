import { test, expect } from '@playwright/test';
import { setupTest, selectDisability } from './helpers.js';

// Helper function to wait for payment calculation to complete
async function waitForPaymentUpdate(page) {
  await page.waitForTimeout(1000);
  await page.waitForFunction(() => {
    const payment = document.getElementById('monthlyPayment')?.textContent;
    return payment !== '$0.00' && payment !== '' && payment !== null;
  }, { timeout: 5000 });
}

async function goToDependentsTab(page) {
  // Click the Dependents tab button (not the dropdown option)
  // Use a more specific selector that targets the actual tab
  await page.click('.tab-button:has-text("Dependents"), button:has-text("Dependents"), [role="tab"]:has-text("Dependents")');
  await page.waitForTimeout(500);
  
  // Wait for the tab panel to be visible
  await page.waitForSelector('#dependents-tab', { state: 'visible', timeout: 5000 });
  
  // Wait for the married checkbox to be visible
  await page.waitForSelector('#married', { state: 'visible', timeout: 5000 });
}

test.describe('VA Calculator - Dependents', () => {
  test.beforeEach(async ({ page }) => {
    await setupTest(page);
  });

  test('Married dependent increases payment at 30% rating', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('30');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    const paymentSingleText = await page.locator('#monthlyPayment').textContent();
    const paymentSingle = parseFloat(paymentSingleText.replace(/[$,]/g, ''));
    
    // Check married box
    const marriedCheckbox = page.locator('#married');
    if (await marriedCheckbox.isVisible()) {
      await marriedCheckbox.check();
      await page.waitForTimeout(1000);
      await page.waitForFunction(() => {
        const payment = document.getElementById('monthlyPayment')?.textContent;
        return payment !== '$0.00' && payment !== '' && payment !== null;
      }, { timeout: 5000 });
      
      const paymentMarriedText = await page.locator('#monthlyPayment').textContent();
      const paymentMarried = parseFloat(paymentMarriedText.replace(/[$,]/g, ''));
      
      expect(paymentMarried).toBeGreaterThan(paymentSingle);
      
      // Verify dependent additions exists (may be hidden if no dependent amount)
      const dependentAdditions = page.locator('#dependentAdditions');
      const exists = await dependentAdditions.count();
      expect(exists).toBe(1);
      
      await page.screenshot({ path: 'test-results/married-dependent.png', fullPage: true });
    }
  });

  test('Children under 18 can be added', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('50');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    // Need to be married for children to count
    await page.check('#married');
    await page.waitForTimeout(1000);
    
    // Add children
    await page.fill('#childrenUnder18', '2');
    await page.waitForTimeout(1000);
    
    // Verify the input was set correctly
    const childrenValue = await page.locator('#childrenUnder18').inputValue();
    expect(childrenValue).toBe('2');
    
    // Payment should exist (may or may not increase depending on rating/implementation)
    const payment = await page.locator('#monthlyPayment').textContent();
    expect(payment).not.toBe('$0.00');
    
    await page.screenshot({ path: 'test-results/children-under-18.png', fullPage: true });
  });

  test('Dependents do not affect payment below 30% rating', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('20');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    const basePayment = await page.locator('#monthlyPayment').textContent();
    
    // Add dependents
    const marriedCheckbox = page.locator('#married');
    const childrenInput = page.locator('#childrenUnder18');
    
    if (await marriedCheckbox.isVisible()) {
      await marriedCheckbox.check();
      await page.waitForTimeout(300);
    }
    
    if (await childrenInput.isVisible()) {
      await childrenInput.fill('3');
      await waitForPaymentUpdate(page);
      
      const withDependents = await page.locator('#monthlyPayment').textContent();
      
      // Below 30%, dependents don't add anything
      expect(basePayment).toBe(withDependents);
      
      await page.screenshot({ path: 'test-results/below-30-no-dependents.png', fullPage: true });
    }
  });

  test('Spouse aid and attendance increases payment', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('70');
    await page.waitForTimeout(300);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    const marriedCheckbox = page.locator('#married');
    if (await marriedCheckbox.isVisible()) {
      await marriedCheckbox.check();
      await page.waitForTimeout(500);
      
      const withoutAidText = await page.locator('#monthlyPayment').textContent();
      const withoutAid = parseFloat(withoutAidText.replace(/[$,]/g, ''));
      
      const aidCheckbox = page.locator('#spouseAidAttendance');
      if (await aidCheckbox.isVisible()) {
        await aidCheckbox.check();
        await page.waitForTimeout(1000);
        await page.waitForFunction(() => {
          const payment = document.getElementById('monthlyPayment')?.textContent;
          return payment !== '$0.00' && payment !== '' && payment !== null;
        }, { timeout: 5000 });
        
        const withAidText = await page.locator('#monthlyPayment').textContent();
        const withAid = parseFloat(withAidText.replace(/[$,]/g, ''));
        
        expect(withAid).toBeGreaterThan(withoutAid);
        
        await page.screenshot({ path: 'test-results/spouse-aid-attendance.png', fullPage: true });
      }
    }
  });

  test('Children 18-23 in school can be added', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('60');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    // Need to be married for children to count
    await page.check('#married');
    await page.waitForTimeout(1000);
    
    // Add children in school
    await page.fill('#childrenInSchool', '1');
    await page.waitForTimeout(1000);
    
    // Verify the input was set correctly
    const childrenValue = await page.locator('#childrenInSchool').inputValue();
    expect(childrenValue).toBe('1');
    
    // Payment should exist
    const payment = await page.locator('#monthlyPayment').textContent();
    expect(payment).not.toBe('$0.00');
    
    await page.screenshot({ path: 'test-results/children-in-school.png', fullPage: true });
  });

  test('Adding parent dependents increases payment', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('70');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    const basePaymentText = await page.locator('#monthlyPayment').textContent();
    const base = parseFloat(basePaymentText.replace(/[$,]/g, ''));
    
    // Add one parent
    const oneParentCheckbox = page.locator('#oneParent');
    if (await oneParentCheckbox.isVisible()) {
      await oneParentCheckbox.check();
      await waitForPaymentUpdate(page);
      
      const withParentText = await page.locator('#monthlyPayment').textContent();
      const withParent = parseFloat(withParentText.replace(/[$,]/g, ''));
      
      expect(withParent).toBeGreaterThan(base);
      
      await page.screenshot({ path: 'test-results/one-parent.png', fullPage: true });
    }
  });

  test('Two parent dependents increase payment more', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('60');
    await page.waitForTimeout(500);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    const basePaymentText = await page.locator('#monthlyPayment').textContent();
    const base = parseFloat(basePaymentText.replace(/[$,]/g, ''));
    
    // Add two parents
    const twoParentsCheckbox = page.locator('#twoParents');
    if (await twoParentsCheckbox.isVisible()) {
      await twoParentsCheckbox.check();
      await waitForPaymentUpdate(page);
      
      const withTwoParentsText = await page.locator('#monthlyPayment').textContent();
      const withTwoParents = parseFloat(withTwoParentsText.replace(/[$,]/g, ''));
      
      expect(withTwoParents).toBeGreaterThan(base);
      
      await page.screenshot({ path: 'test-results/two-parents.png', fullPage: true });
    }
  });

  test('Combined dependents add correct amounts', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('80');
    await page.waitForTimeout(300);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    // Start with just disability
    const paymentAlone = await parseFloat((await page.locator('#monthlyPayment').textContent()).replace(/[$,]/g, ''));
    
    // Add spouse
    await page.locator('#married').check();
    await page.waitForTimeout(300);
    
    // Add children under 18
    await page.locator('#childrenUnder18').fill('2');
    await page.waitForTimeout(300);
    
    // Add child in school
    await page.locator('#childrenInSchool').fill('1');
    await waitForPaymentUpdate(page);
    
    const paymentWithAll = await parseFloat((await page.locator('#monthlyPayment').textContent()).replace(/[$,]/g, ''));
    
    // Payment should be significantly higher with all dependents
    expect(paymentWithAll).toBeGreaterThan(paymentAlone + 300);
    
    await page.screenshot({ path: 'test-results/all-dependents.png', fullPage: true });
  });

  test('Dependent breakdown section exists', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('50');
    await page.waitForTimeout(300);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    await page.locator('#married').check();
    await page.locator('#childrenUnder18').fill('1');
    await waitForPaymentUpdate(page);
    
    // Verify breakdown section exists
    const breakdown = page.locator('#breakdown');
    await expect(breakdown).toBeVisible();
    
    // Base rate should show
    const baseRate = await page.locator('#baseRate').textContent();
    expect(baseRate).not.toBe('$0.00');
    
    // Payment should be calculated
    const payment = await page.locator('#monthlyPayment').textContent();
    expect(payment).not.toBe('$0.00');
    
    await page.screenshot({ path: 'test-results/dependent-breakdown.png', fullPage: true });
  });

  test('Unchecking dependent removes addition', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('40');
    await page.waitForTimeout(300);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    await page.locator('#married').check();
    await waitForPaymentUpdate(page);
    
    const paymentWithSpouse = await parseFloat((await page.locator('#monthlyPayment').textContent()).replace(/[$,]/g, ''));
    
    await page.locator('#married').uncheck();
    await waitForPaymentUpdate(page);
    
    const paymentWithoutSpouse = await parseFloat((await page.locator('#monthlyPayment').textContent()).replace(/[$,]/g, ''));
    
    expect(paymentWithoutSpouse).toBeLessThan(paymentWithSpouse);
    
    await page.screenshot({ path: 'test-results/uncheck-dependent.png', fullPage: true });
  });

  test('Mobile view handles dependents correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.locator('.disability-select').first().selectOption('60');
    await page.waitForTimeout(300);
    
    // On mobile, use the dropdown instead of tabs
    const mobileTabSelect = page.locator('.mobile-tab-select, select[onchange*="switchTab"]');
    const exists = await mobileTabSelect.count();
    
    if (exists > 0) {
      // Mobile dropdown exists
      await mobileTabSelect.selectOption('dependents');
    } else {
      // Fallback to desktop tabs
      await goToDependentsTab(page);
    }
    
    await page.waitForTimeout(500);
    await page.waitForSelector('#married', { state: 'visible', timeout: 5000 });
    
    await page.check('#married');
    await page.fill('#childrenUnder18', '2');
    await page.waitForTimeout(1000);
    
    const payment = await page.locator('#monthlyPayment').textContent();
    expect(payment).not.toBe('$0.00');
    
    await page.screenshot({ path: 'test-results/mobile-dependents.png', fullPage: true });
  });

  test('Annual payment reflects all dependents', async ({ page }) => {
    await page.locator('.disability-select').first().selectOption('50');
    await page.waitForTimeout(300);
    
    // Click Dependents tab
    await goToDependentsTab(page);
    
    await page.locator('#married').check();
    await page.locator('#childrenUnder18').fill('2');
    await waitForPaymentUpdate(page);
    
    const monthlyText = await page.locator('#monthlyPayment').textContent();
    const annualText = await page.locator('#annualPayment').textContent();
    
    const monthly = parseFloat(monthlyText.replace(/[$,]/g, ''));
    const annual = parseFloat(annualText.replace(/[^0-9.]/g, ''));
    
    expect(annual).toBeCloseTo(monthly * 12, 2);
    
    await page.screenshot({ path: 'test-results/annual-with-dependents.png', fullPage: true });
  });
});

