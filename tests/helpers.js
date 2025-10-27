/**
 * Helper functions for VA Calculator tests
 */

export async function setupTest(page) {
  // Go to calculator page - CORRECTED PATH
  await page.goto('/va-calculator/', { waitUntil: 'networkidle' });
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for calculator to initialize
  await page.waitForFunction(() => {
    return document.querySelector('#disability1') !== null;
  }, { timeout: 10000 });
  
  // Additional wait for JavaScript to initialize
  await page.waitForTimeout(1000);
}

export async function selectDisability(page, disabilityNumber, percentage) {
  const selector = `#disability${disabilityNumber}`;
  
  // Wait for element to exist
  await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
  
  // Select the option
  await page.selectOption(selector, percentage.toString());
  
  // Wait for calculation to complete
  await page.waitForTimeout(500);
}

export async function addDisability(page) {
  const addButton = page.locator('button:has-text("Add"), button:has-text("Disability")');
  if (await addButton.count() > 0) {
    await addButton.first().click();
    await page.waitForTimeout(1000);
    return true;
  }
  return false;
}

export async function waitForCalculation(page) {
  await page.waitForTimeout(500);
  // Optionally wait for specific calculation indicators
  try {
    await page.waitForSelector('#ratingNumber, .rating-number', { state: 'visible', timeout: 2000 });
  } catch (e) {
    // Calculation indicator not found, but that's okay
  }
}
