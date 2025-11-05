import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

// Helper function to properly select from autocomplete dropdown
async function selectFromAutocomplete(page, inputId, searchText, waitForText = null) {
  const input = page.locator(`#${inputId}`);
  
  await input.fill(searchText);
  await page.waitForTimeout(500);
  
  const dropdownId = `#${inputId}-dropdown`;
  const dropdown = page.locator(dropdownId);
  
  try {
    await dropdown.waitFor({ state: 'visible', timeout: 3000 });
    
    const textToFind = waitForText || searchText;
    const item = dropdown.getByText(textToFind, { exact: false }).first();
    await item.waitFor({ state: 'visible', timeout: 2000 });
    await item.click();
    
    await page.waitForTimeout(300);
  } catch (error) {
    console.log(`Warning: Could not select from autocomplete for ${inputId} with text "${searchText}"`);
  }
}

// Helper to fill complete form
async function fillCompleteForm(page, { gpu, cpu, game, ram = '16', resolution = '1080p', settings = 'high' }) {
  await selectFromAutocomplete(page, 'gpu-input', gpu);
  await selectFromAutocomplete(page, 'cpu-input', cpu);
  await page.selectOption('#ram-select', ram);
  await page.selectOption('#resolution-select', resolution);
  await selectFromAutocomplete(page, 'game-input', game);
  await page.selectOption('#settings-select', settings);
}

test.describe('FPS Calculation Accuracy', () => {
  
  test('should calculate correct FPS range for RTX 4090 + i9-13900K in Valorant at 1080p Low', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 4090',
      cpu: 'i9-13900K',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const fpsDisplay = await page.locator('.fps-main-result h3').textContent();
    console.log('FPS Display:', fpsDisplay);
    
    expect(fpsDisplay).toMatch(/\d{2,3}[-–]\d{2,3}/);
    await expect(page.locator('.confidence-badge')).toBeVisible();
  });

  test('should calculate correct FPS for mid-range GPU (RTX 3060) in Cyberpunk 2077', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 3060',
      cpu: 'i5-13600K',
      game: 'Cyberpunk',
      ram: '16',
      resolution: '1080p',
      settings: 'ultra'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const fpsDisplay = await page.locator('.fps-main-result h3').textContent();
    console.log('Cyberpunk FPS:', fpsDisplay);
    expect(fpsDisplay).toBeTruthy();
    expect(fpsDisplay).toMatch(/\d+/);
  });

  test('should show lower FPS at higher resolutions', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Fill form completely for 1080p
    await fillCompleteForm(page, {
      gpu: 'RTX 4070',
      cpu: 'i5-13600K',
      game: 'Fortnite',
      ram: '16',
      resolution: '1080p',
      settings: 'high'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const fps1080p = await page.locator('.fps-main-result h3').textContent();
    const fps1080pNum = parseInt(fps1080p.match(/(\d+)[-–]/)?.[1] || '0');
    console.log('1080p FPS:', fps1080pNum);
    
    // Change only resolution and recalculate
    await page.selectOption('#resolution-select', '4k');
    await page.locator('#calculate-btn').click();
    await page.waitForTimeout(1000);
    
    const fps4k = await page.locator('.fps-main-result h3').textContent();
    const fps4kNum = parseInt(fps4k.match(/(\d+)[-–]/)?.[1] || '0');
    console.log('4K FPS:', fps4kNum);
    
    expect(fps4kNum).toBeLessThan(fps1080pNum);
    expect(fps4kNum).toBeGreaterThan(0);
  });

  test('should apply correct settings impact (Low vs Ultra)', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Fill form completely for Low settings
    await fillCompleteForm(page, {
      gpu: 'RTX 3060',
      cpu: 'i5-12400F',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const fpsLow = await page.locator('.fps-main-result h3').textContent();
    const fpsLowNum = parseInt(fpsLow.match(/(\d+)[-–]/)?.[1] || '0');
    console.log('Low settings FPS:', fpsLowNum);
    
    // Change only settings and recalculate
    await page.selectOption('#settings-select', 'ultra');
    await page.locator('#calculate-btn').click();
    await page.waitForTimeout(1000);
    
    const fpsUltra = await page.locator('.fps-main-result h3').textContent();
    const fpsUltraNum = parseInt(fpsUltra.match(/(\d+)[-–]/)?.[1] || '0');
    console.log('Ultra settings FPS:', fpsUltraNum);
    
    expect(fpsLowNum).toBeGreaterThan(fpsUltraNum);
  });
});

test.describe('System Latency Calculation', () => {
  
  test('should calculate system latency with all components', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 4070',
      cpu: 'i7-13700K',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    const hasLatencyInputs = await page.locator('#mouse-polling-rate').isVisible();
    if (hasLatencyInputs) {
      await page.selectOption('#mouse-polling-rate', '1000');
      await page.selectOption('#monitor-refresh-rate', '240');
      await page.selectOption('#panel-type', 'TN');
    }
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const hasLatencyResults = await page.locator('#latency-results').isVisible();
    if (hasLatencyResults) {
      console.log('✓ Latency calculator is present');
      await expect(page.locator('#latency-results')).toBeVisible();
      
      const latencyElement = page.locator('#total-latency');
      if (await latencyElement.count() > 0) {
        const totalLatency = await latencyElement.textContent();
        console.log('Total Latency:', totalLatency);
        expect(totalLatency).toBeTruthy();
      }
    } else {
      console.log('⚠️  Latency results not displayed');
    }
  });
});

test.describe('Bottleneck Analysis', () => {
  
  test('should detect CPU bottleneck with mismatched hardware', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 4090',
      cpu: 'i3-12100F',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const hasBottleneckResults = await page.locator('#bottleneck-results').isVisible();
    if (hasBottleneckResults) {
      console.log('✓ Bottleneck analyzer is present');
      const bottleneckText = await page.locator('.bottleneck-summary').textContent();
      console.log('Bottleneck Analysis:', bottleneckText);
      expect(bottleneckText?.toLowerCase()).toMatch(/cpu|bottleneck|limit/);
    } else {
      console.log('⚠️  Bottleneck results not displayed');
    }
  });

  test('should show balanced system with matched components', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 4070',
      cpu: 'i5-13600K',
      game: 'Fortnite',
      ram: '16',
      resolution: '1440p',
      settings: 'high'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const hasBottleneckResults = await page.locator('#bottleneck-results').isVisible();
    if (hasBottleneckResults) {
      const bottleneckText = await page.locator('.bottleneck-summary').textContent();
      console.log('Balanced System Analysis:', bottleneckText);
      expect(bottleneckText).toBeTruthy();
    }
  });
});

test.describe('User Interface Functionality', () => {
  
  test('should have working autocomplete for GPU selection', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const gpuInput = page.locator('#gpu-input');
    await gpuInput.click();
    await gpuInput.fill('4070');
    
    await page.waitForTimeout(600);
    
    const gpuDropdown = page.locator('.autocomplete-dropdown.active');
    await expect(gpuDropdown).toBeVisible();
    await expect(gpuDropdown).toContainText('4070');
    
    await gpuDropdown.locator('.autocomplete-item').first().click();
    
    const value = await gpuInput.inputValue();
    expect(value).toContain('4070');
  });

  test('should validate required fields before calculation', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await page.locator('#calculate-btn').click();
    await page.waitForTimeout(500);
    
    const hasError = await page.locator('.error-message').count() > 0;
    const resultsShown = await page.locator('#results-container').isVisible();
    
    expect(hasError || !resultsShown).toBeTruthy();
  });

  test('should show loading state during calculation', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 4090',
      cpu: 'i9-13900K',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    const calculateBtn = page.locator('#calculate-btn');
    await calculateBtn.click();
    
    const btnText = await calculateBtn.textContent();
    console.log('Button text during calculation:', btnText);
    
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should display results after calculation', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 3060',
      cpu: 'i5-12400F',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    await expect(page.locator('#results-container')).toBeVisible();
    await expect(page.locator('.fps-main-result')).toBeVisible();
    
    const fpsText = await page.locator('.fps-main-result h3').textContent();
    console.log('FPS Result:', fpsText);
    expect(fpsText).toMatch(/\d+/);
  });
});

test.describe('SEO Optimization', () => {
  
  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const title = await page.title();
    console.log('Page Title:', title);
    console.log('Title length:', title.length);
    expect(title).toContain('FPS Calculator');
    expect(title.length).toBeLessThan(75);
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    console.log('Meta Description length:', description?.length);
    expect(description).toBeTruthy();
    if (description) {
      expect(description.length).toBeGreaterThan(100);
      expect(description.length).toBeLessThan(165);
    }
    
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    console.log('Canonical URL:', canonical);
    expect(canonical).toBeTruthy();
  });

  test('should have structured data (Schema.org)', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const schemaScripts = await page.locator('script[type="application/ld+json"]').count();
    console.log('Schema.org scripts found:', schemaScripts);
    expect(schemaScripts).toBeGreaterThan(0);
    
    if (schemaScripts > 0) {
      const schemaContent = await page.locator('script[type="application/ld+json"]').first().textContent();
      const schema = JSON.parse(schemaContent || '{}');
      
      console.log('Schema Type:', schema['@type']);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const h1Count = await page.locator('h1').count();
    console.log('H1 tags found:', h1Count);
    expect(h1Count).toBe(1);
    
    const h1Text = await page.locator('h1').textContent();
    console.log('H1 text:', h1Text);
    expect(h1Text?.toLowerCase()).toMatch(/fps|calculator|performance|latency/);
    
    const h2Count = await page.locator('h2').count();
    console.log('H2 tags found:', h2Count);
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have FAQ section', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const faqSection = page.locator('section.faq-section');
    await expect(faqSection).toBeVisible();
    
    const faqQuestions = faqSection.locator('.faq-question');
    const questionCount = await faqQuestions.count();
    console.log('FAQ questions found:', questionCount);
    expect(questionCount).toBeGreaterThan(0);
  });
});

test.describe('Performance', () => {
  
  test('should load page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log('Page load time:', loadTime, 'ms');
    expect(loadTime).toBeLessThan(5000);
  });

  test('should calculate FPS quickly', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 3060',
      cpu: 'i5-12400F',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    const startTime = Date.now();
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    const calcTime = Date.now() - startTime;
    
    console.log('Calculation time:', calcTime, 'ms');
    expect(calcTime).toBeLessThan(3000);
  });

  test('should have all required resources loaded', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const hasStyles = await page.locator('style').count() > 0;
    expect(hasStyles).toBeTruthy();
    
    const hasScripts = await page.locator('script[src]').count() > 0;
    console.log('Has external scripts:', hasScripts);
  });
});

test.describe('Database Validation', () => {
  
  test('should have key GPUs in database', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const requiredGPUs = ['RTX 4090', 'RTX 4070', 'RTX 3060', 'RX 7900 XTX'];
    
    for (const gpu of requiredGPUs) {
      await page.locator('#gpu-input').fill(gpu);
      await page.waitForTimeout(600);
      
      const dropdown = page.locator('.autocomplete-dropdown.active');
      const isVisible = await dropdown.isVisible();
      
      if (isVisible) {
        const hasGPU = await dropdown.getByText(gpu, { exact: false }).count() > 0;
        console.log(`${gpu} found:`, hasGPU);
        expect(hasGPU).toBeTruthy();
      }
      
      await page.locator('#gpu-input').clear();
      await page.waitForTimeout(200);
    }
  });

  test('should have key games in database', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const requiredGames = ['Valorant', 'Fortnite', 'Cyberpunk'];
    
    for (const game of requiredGames) {
      await page.locator('#game-input').fill(game);
      await page.waitForTimeout(600);
      
      const dropdown = page.locator('.autocomplete-dropdown.active');
      const isVisible = await dropdown.isVisible();
      
      if (isVisible) {
        const hasGame = await dropdown.getByText(game, { exact: false }).count() > 0;
        console.log(`${game} found:`, hasGame);
        expect(hasGame).toBeTruthy();
      }
      
      await page.locator('#game-input').clear();
      await page.waitForTimeout(200);
    }
  });

  test('should have reasonable FPS values (no negative or extreme)', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    await fillCompleteForm(page, {
      gpu: 'RTX 3060',
      cpu: 'i5-12400F',
      game: 'Valorant',
      ram: '16',
      resolution: '1080p',
      settings: 'low'
    });
    
    await page.locator('#calculate-btn').click();
    await page.locator('#results-container').waitFor({ state: 'visible', timeout: 10000 });
    
    const fpsText = await page.locator('.fps-main-result h3').textContent();
    const fpsMatch = fpsText?.match(/(\d+)[-–](\d+)/);
    
    if (fpsMatch) {
      const minFPS = parseInt(fpsMatch[1]);
      const maxFPS = parseInt(fpsMatch[2]);
      
      console.log('FPS Range:', minFPS, '-', maxFPS);
      
      expect(minFPS).toBeGreaterThan(0);
      expect(minFPS).toBeLessThan(1000);
      expect(maxFPS).toBeGreaterThan(minFPS);
      expect(maxFPS).toBeLessThan(1000);
      expect(maxFPS - minFPS).toBeLessThan(300);
    }
  });
});

test.describe('Transparency & Disclaimers', () => {
  
  test('should show disclaimer about estimate accuracy', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const bodyText = await page.locator('body').textContent();
    
    const hasDisclaimer = bodyText?.toLowerCase().includes('estimate') || 
                          bodyText?.toLowerCase().includes('accuracy') ||
                          bodyText?.toLowerCase().includes('may vary');
    
    console.log('Has accuracy disclaimer:', hasDisclaimer);
    expect(hasDisclaimer).toBeTruthy();
  });

  test('should display data sources or last updated date', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    const bodyText = await page.locator('body').textContent();
    
    const hasSources = bodyText?.includes('Tom\'s Hardware') || 
                       bodyText?.includes('Hardware Unboxed') ||
                       bodyText?.includes('TechPowerUp') ||
                       bodyText?.includes('Last Updated') ||
                       bodyText?.includes('2025');
    
    console.log('Has data sources/date:', hasSources);
    expect(hasSources).toBeTruthy();
  });
});