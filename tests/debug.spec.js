import { test, expect } from '@playwright/test';

test('Debug - Find VA Calculator', async ({ page }) => {
  // Try to load the homepage
  await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
  
  await page.screenshot({ path: 'test-results/debug-homepage.png', fullPage: true });
  
  const title = await page.title();
  console.log('Page title:', title);
  console.log('Current URL:', page.url());
  
  // Try different paths
  const paths = [
    '/va-calculator.html',
    '/va-calculator/index.html',
    '/va-calculator/',
    '/index.html',
  ];
  
  for (const path of paths) {
    try {
      const response = await page.goto(path, { timeout: 5000, waitUntil: 'domcontentloaded' });
      console.log(`✅ ${path} - Status: ${response.status()}`);
      
      if (response.status() === 200) {
        await page.screenshot({ path: `test-results/found-${path.replace(/\//g, '-')}.png`, fullPage: true });
        
        const hasDisabilityInput = await page.locator('#disability1').count();
        console.log(`   Has #disability1: ${hasDisabilityInput > 0 ? 'YES' : 'NO'}`);
        
        const selects = await page.locator('select').count();
        console.log(`   Number of select elements: ${selects}`);
        
        const bodyText = await page.locator('body').textContent();
        console.log(`   Body contains "VA": ${bodyText.includes('VA') ? 'YES' : 'NO'}`);
        console.log(`   Body contains "Disability": ${bodyText.includes('Disability') ? 'YES' : 'NO'}`);
      }
    } catch (error) {
      console.log(`❌ ${path} - Not found`);
    }
  }
});






















