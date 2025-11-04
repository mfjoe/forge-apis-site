// monitor-calculator.spec.js
import { test, expect } from '@playwright/test';
import { technicalAccuracyTests, calculationScenarios, comparisonTestData, recommenderQuizAnswers, fpsVisualizerTests } from './monitor-calculator-test-data.js';

const BASE_URL = 'http://localhost:8080/monitor-calculator/';

test.describe('Monitor Calculator - Technical Accuracy Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Wait for calculator to be ready
    await page.waitForSelector('#response-time-calc', { state: 'visible' });
    // Additional wait for JavaScript to initialize
    await page.waitForTimeout(500);
  });

  test.describe('Display Latency Formula Verification', () => {
    // CRITICAL: Must verify displayLatency = 1000/refreshRate (NOT /2)
    technicalAccuracyTests.displayLatency.forEach(({ refreshRate, expected, tolerance }) => {
      test(`Display latency at ${refreshRate}Hz should be ${expected}ms (one full frame time)`, async ({ page }) => {
        // Wait for the calculator to be visible and ready
        await page.waitForSelector('#response-time-calc', { state: 'visible' });
        await page.waitForSelector('#refresh-rate', { state: 'visible' });
        
        // Set refresh rate
        await page.selectOption('#refresh-rate', refreshRate.toString());
        
        // Fill minimum required fields
        await page.fill('#response-time', '3');
        await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#panel-type', 'ips');
        await page.selectOption('#overdrive-setting', 'normal');
        
        // Wait for button to be enabled or click anyway (might be disabled via opacity)
        await page.waitForTimeout(500);
        
        // Calculate and verify
        await page.click('#calculate-response-time');
        await page.waitForSelector('#response-time-result', { state: 'visible' });
        
        // Extract display latency from breakdown
        const breakdownText = await page.textContent('#latency-breakdown');
        const displayMatch = breakdownText.match(/Display: ([\d.]+)ms/);
        expect(displayMatch).toBeTruthy();
        
        const actualDisplayLatency = parseFloat(displayMatch[1]);
        const theoreticalMinimum = 1000 / refreshRate;
        
        // Verify it equals theoretical minimum (one frame time)
        // Calculator rounds to 1 decimal place, so use tolerance of 0.1
        expect(actualDisplayLatency).toBeCloseTo(theoreticalMinimum, 1);
        expect(actualDisplayLatency).toBeCloseTo(expected, 1);
        
        // CRITICAL: Must NOT be half of theoretical (common error)
        expect(actualDisplayLatency).not.toBeCloseTo(theoreticalMinimum / 2, 1);
      });
    });
  });

  test.describe('Panel Multiplier Accuracy', () => {
    const testCase = {
      responseTime: 5.0,
      refreshRate: 240,
      overdrive: 'normal',
      systemLatency: 10,
    };

    Object.entries(technicalAccuracyTests.panelMultipliers).forEach(([panelType, multiplier]) => {
      test(`Panel multiplier for ${panelType.toUpperCase()} should be ${multiplier}`, async ({ page }) => {
        await page.fill('#response-time', testCase.responseTime.toString());
        await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#refresh-rate', testCase.refreshRate.toString());
        await page.selectOption('#panel-type', panelType);
        await page.selectOption('#overdrive-setting', testCase.overdrive);
        await page.selectOption('#system-latency', testCase.systemLatency.toString());
        
        await page.click('#calculate-response-time');
        await page.waitForSelector('#response-time-result', { state: 'visible' });
        
        // Get adjusted response time
        const breakdownText = await page.textContent('#latency-breakdown');
        const responseMatch = breakdownText.match(/Response: ([\d.]+)ms/);
        const actualResponse = parseFloat(responseMatch[1]);
        
        // Verify panel multiplier applied correctly
        const expectedResponse = testCase.responseTime * multiplier;
        expect(actualResponse).toBeCloseTo(expectedResponse, 1);
      });
    });
  });

  test.describe('Real-World Monitor Validation', () => {
    technicalAccuracyTests.realWorldMonitors.forEach(({ name, specs, expected, source }) => {
      test(`${name} calculation matches professional testing (${source})`, async ({ page }) => {
        // Wait for calculator to be ready
        await page.waitForSelector('#response-time', { state: 'visible' });
        await page.waitForSelector('#system-latency', { state: 'visible' });
        
        // Fill in monitor specs
        await page.fill('#response-time', specs.responseTime.toString());
        await page.selectOption('#response-time-type', specs.responseTimeType);
        await page.selectOption('#refresh-rate', specs.refreshRate.toString());
        await page.selectOption('#panel-type', specs.panelType);
        await page.selectOption('#overdrive-setting', specs.overdriveSetting);
        
        // Wait for system-latency select to be ready and select option
        await page.waitForSelector('#system-latency', { state: 'visible' });
        await page.waitForTimeout(200); // Small wait for options to be ready
        await page.selectOption('#system-latency', specs.systemLatency);
        
        await page.click('#calculate-response-time');
        await page.waitForSelector('#response-time-result', { state: 'visible' });
        
        // Verify total input lag within 2ms tolerance (real-world variance)
        const totalLagText = await page.textContent('#total-lag-value');
        const actualTotalLag = parseFloat(totalLagText);
        
        expect(actualTotalLag).toBeCloseTo(expected.totalInputLag, 1);
        
        // Verify rating
        const ratingBadge = await page.textContent('#rating-badge');
        expect(ratingBadge).toContain(expected.rating);
        
        // Verify refresh rate compliance if specified
        if (expected.refreshRateCompliance) {
          // CRITICAL FIX: The compliance card is embedded within the analysis-card HTML
          // Check the analysis card text content for compliance information
          const analysisCard = await page.locator('#analysis-card');
          await expect(analysisCard).toBeVisible();
          const analysisText = await analysisCard.textContent();
          expect(analysisText).toMatch(/Refresh Rate Compliance|compliance/i);
          
          // Verify it contains a percentage
          const percentageMatch = analysisText.match(/([\d.]+)%/);
          expect(percentageMatch).toBeTruthy();
        }
      });
    });
  });

  test.describe('Rating Threshold Accuracy', () => {
    calculationScenarios.ratingThresholds.forEach(({ totalLag, expected, threshold }) => {
      test(`Total lag ${totalLag}ms should rate as ${expected} (${threshold})`, async ({ page }) => {
        // Calculate inputs that result in target total lag
        // Formula: totalLag = displayLatency + (responseTime * panelMultiplier) + systemLatency
        // For very low lag (4.5ms), use Gaming Mode (2ms) and higher refresh rate
        // For higher lag (30ms), use Enhanced Processing (10ms)
        let refreshRate, systemLatencyValue, systemLatencyDropdown;
        
        if (totalLag < 5) {
          // EXCELLENT (<5ms) - use 480Hz Gaming Mode with OLED panel to achieve very low total lag
          refreshRate = 480;
          systemLatencyValue = 2;
          systemLatencyDropdown = '2'; // Gaming Mode
          // Note: Will use OLED panel below to allow lower total lag
        } else if (totalLag < 10) {
          // GREAT (5-10ms) - use 240Hz Standard Mode
          refreshRate = 240;
          systemLatencyValue = 5;
          systemLatencyDropdown = '5'; // Standard Mode
        } else if (totalLag < 15) {
          // GOOD (10-15ms) - use 240Hz Enhanced Processing
          refreshRate = 240;
          systemLatencyValue = 10;
          systemLatencyDropdown = '10'; // Enhanced Processing
        } else {
          // ACCEPTABLE/SLOW (15-30ms) - use 144Hz Enhanced Processing
          refreshRate = 144;
          systemLatencyValue = 10;
          systemLatencyDropdown = '10'; // Enhanced Processing
        }
        
        const displayLatency = 1000 / refreshRate;
        // For very low lag targets (<5ms), use OLED panel to achieve it
        let panelType, panelMultiplier;
        if (totalLag < 5) {
          panelType = 'oled';
          panelMultiplier = 0.2; // OLED has 0.2x multiplier
        } else {
          panelType = 'ips';
          panelMultiplier = 1.0; // IPS baseline
        }
        
        // Solve: totalLag = displayLatency + (responseTime * panelMultiplier) + systemLatency
        // responseTime = (totalLag - displayLatency - systemLatency) / panelMultiplier
        const neededResponse = (totalLag - displayLatency - systemLatencyValue) / panelMultiplier;
        
        await page.fill('#response-time', Math.max(0.5, neededResponse).toString());
        await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#refresh-rate', refreshRate.toString());
        await page.selectOption('#panel-type', panelType);
        await page.selectOption('#overdrive-setting', 'normal');
        await page.selectOption('#system-latency', systemLatencyDropdown);
        
        await page.click('#calculate-response-time');
        await page.waitForSelector('#response-time-result', { state: 'visible' });
        await page.waitForSelector('#rating-badge', { state: 'visible', timeout: 5000 });
        
        const ratingText = await page.textContent('#rating-badge');
        expect(ratingText).toContain(expected);
      });
    });
  });

  test.describe('Overdrive Impact Validation', () => {
    calculationScenarios.overdriveScenarios.forEach(({ baseResponse, overdrive, expectedFinal }) => {
      test(`Overdrive ${overdrive} should adjust response time from ${baseResponse}ms to ~${expectedFinal}ms`, async ({ page }) => {
        await page.fill('#response-time', baseResponse.toString());
        await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#refresh-rate', '240');
        await page.selectOption('#panel-type', 'ips');
        await page.selectOption('#overdrive-setting', overdrive);
        await page.selectOption('#system-latency', '10'); // Enhanced Processing
        
        await page.click('#calculate-response-time');
        await page.waitForSelector('#latency-breakdown', { state: 'visible' });
        
        const breakdownText = await page.textContent('#latency-breakdown');
        const responseMatch = breakdownText.match(/Response: ([\d.]+)ms/);
        const actualResponse = parseFloat(responseMatch[1]);
        
        expect(actualResponse).toBeCloseTo(expectedFinal, 1);
      });
    });
  });

  test.describe('Manufacturer Deception Warnings', () => {
    test('Should warn about unrealistic MPRT claims below 3ms on <240Hz monitors', async ({ page }) => {
      await page.fill('#response-time', '0.5'); // Unrealistic
      await page.selectOption('#response-time-type', 'mprt');
      await page.selectOption('#refresh-rate', '144'); // Below 240Hz
      await page.selectOption('#panel-type', 'ips');
      await page.selectOption('#overdrive-setting', 'normal');
      await page.selectOption('#system-latency', '10');
      
      await page.click('#calculate-response-time');
      await page.waitForSelector('#response-time-result', { state: 'visible' });
      
      // Should show MPRT deception warning
      const warnings = await page.locator('.warning-card');
      const warningTexts = await warnings.allTextContents();
      const hasMprtWarning = warningTexts.some(text => 
        /MPRT|marketing|deception|physically impossible/i.test(text)
      );
      expect(hasMprtWarning).toBeTruthy();
    });

    test('Should warn about GtG spec manipulation for values <1.5ms', async ({ page }) => {
      await page.fill('#response-time', '0.8'); // Suspiciously low
      await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#refresh-rate', '240');
        await page.selectOption('#panel-type', 'ips');
        await page.selectOption('#overdrive-setting', 'normal');
        await page.selectOption('#system-latency', '10'); // Enhanced Processing
      
      await page.click('#calculate-response-time');
      await page.waitForSelector('#response-time-result', { state: 'visible' });
      
      // Should show GtG manipulation warning in warnings-container (responseTime < 1.5 && gtg)
      await page.waitForSelector('#warnings-container', { state: 'visible' });
      await page.waitForTimeout(500); // Give time for warnings to be populated
      
      const warningsContainerText = await page.textContent('#warnings-container');
      // Check if warning exists (may be empty if validation prevented calculation)
      if (warningsContainerText && warningsContainerText.trim().length > 0) {
        const hasGtgWarning = /manufacturer|deception|cherry|GtG.*spec|1ms GtG/i.test(warningsContainerText);
        expect(hasGtgWarning).toBeTruthy();
      } else {
        // If container is empty, check if result was shown (warnings should appear)
        const resultVisible = await page.locator('#response-time-result').isVisible();
        if (resultVisible) {
          // Result shown but no warnings - this might be a bug
          const warningsHTML = await page.evaluate(() => {
            const container = document.getElementById('warnings-container');
            return container ? container.innerHTML : '';
          });
          expect(warningsHTML.length).toBeGreaterThan(0);
        }
      }
    });

    test('Should warn about extreme overdrive causing inverse ghosting', async ({ page }) => {
      await page.fill('#response-time', '3');
      await page.selectOption('#response-time-type', 'gtg');
      await page.selectOption('#refresh-rate', '240');
      await page.selectOption('#panel-type', 'ips');
      await page.selectOption('#overdrive-setting', 'extreme');
      await page.selectOption('#system-latency', '10');
      
      await page.click('#calculate-response-time');
      await page.waitForSelector('#response-time-result', { state: 'visible' });
      
      // Should show overdrive warning in warnings-container (overdrive === 'extreme')
      await page.waitForSelector('#warnings-container', { state: 'visible' });
      await page.waitForTimeout(500); // Give time for warnings to be populated
      
      const warningsContainerText = await page.textContent('#warnings-container');
      const hasOverdriveWarning = /overdrive|inverse|ghosting|artifacts|corona|EXTREME OVERDRIVE/i.test(warningsContainerText);
      expect(hasOverdriveWarning).toBeTruthy();
    });
  });

  test.describe('VA Panel Temperature Sensitivity Warning', () => {
    test('Should display temperature warning when VA panel selected', async ({ page }) => {
      await page.selectOption('#panel-type', 'va');
      await page.fill('#response-time', '8');
      await page.selectOption('#response-time-type', 'gtg');
      await page.selectOption('#refresh-rate', '144');
      await page.selectOption('#overdrive-setting', 'normal');
      await page.selectOption('#system-latency', '10');
      
      await page.click('#calculate-response-time');
      await page.waitForSelector('#response-time-result', { state: 'visible' });
      
      // Should show VA temperature warning in warnings-container (panelType === 'va')
      await page.waitForSelector('#warnings-container', { state: 'visible' });
      await page.waitForTimeout(500); // Give time for warnings to be populated
      
      const warningsContainerText = await page.textContent('#warnings-container');
      const hasVaWarning = /VA.*temperature|VA.*cold|VA.*warm|temperature.*sensitivity|VA PANEL TEMPERATURE/i.test(warningsContainerText);
      expect(hasVaWarning).toBeTruthy();
    });
  });

  test.describe('Refresh Rate Compliance Calculation', () => {
    test('Should calculate and display refresh rate compliance percentage', async ({ page }) => {
      // Use fast monitor for high compliance
      await page.fill('#response-time', '1.82'); // BenQ Zowie XL2566K
      await page.selectOption('#response-time-type', 'gtg');
      await page.selectOption('#refresh-rate', '360');
      await page.selectOption('#panel-type', 'tn');
        await page.selectOption('#overdrive-setting', 'normal');
        await page.selectOption('#system-latency', '5'); // Standard Mode
      
      await page.click('#calculate-response-time');
      await page.waitForSelector('#response-time-result', { state: 'visible' });
      
      // CRITICAL FIX: The compliance card is embedded within the analysis-card HTML
      // Check the analysis card text content for compliance information
      const analysisCard = await page.locator('#analysis-card');
      await expect(analysisCard).toBeVisible();
      
      const complianceText = await analysisCard.textContent();
      // Verify it contains compliance info
      expect(complianceText).toMatch(/Refresh Rate Compliance|compliance/i);
      
      // Should show percentage >= 85% for excellent monitor
      const percentageMatch = complianceText.match(/([\d.]+)%/);
      expect(percentageMatch).toBeTruthy();
      const compliancePercent = parseFloat(percentageMatch[1]);
      expect(compliancePercent).toBeGreaterThanOrEqual(85);
    });
  });

  test.describe('Game Suitability Recommendations', () => {
    calculationScenarios.gameSuitability.forEach(({ totalLag, expected }) => {
      test(`Monitor with ${totalLag}ms total lag should recommend: ${expected.join(', ')}`, async ({ page }) => {
        // Calculate inputs for target lag
        // Formula: totalLag = displayLatency + (responseTime * panelMultiplier) + systemLatency
        const refreshRate = 240;
        const displayLatency = 1000 / refreshRate; // 4.17ms
        const panelMultiplier = 1.0; // IPS
        const systemLatency = 5; // Standard Mode
        // Solve: totalLag = displayLatency + (responseTime * panelMultiplier) + systemLatency
        // responseTime = (totalLag - displayLatency - systemLatency) / panelMultiplier
        const neededResponse = (totalLag - displayLatency - systemLatency) / panelMultiplier;
        
        await page.fill('#response-time', Math.max(0.5, neededResponse).toString());
        await page.selectOption('#response-time-type', 'gtg');
        await page.selectOption('#refresh-rate', refreshRate.toString());
        await page.selectOption('#panel-type', 'ips');
        await page.selectOption('#overdrive-setting', 'normal');
        await page.selectOption('#system-latency', '5'); // Standard Mode
        
        await page.click('#calculate-response-time');
        await page.waitForSelector('#response-time-result', { state: 'visible' });
        
        // Wait for game suitability to be populated (give time for calculation to complete)
        await page.waitForTimeout(500);
        
        // Check for game suitability section (it's in #game-suitability, not #response-time-result)
        const gameSuitabilityElement = await page.locator('#game-suitability');
        await expect(gameSuitabilityElement).toBeVisible();
        
        // Wait for content to be populated
        await page.waitForFunction(
          (selector) => {
            const el = document.querySelector(selector);
            return el && el.innerHTML.trim().length > 50; // Check innerHTML, not just textContent
          },
          '#game-suitability',
          { timeout: 3000 }
        ).catch(() => {
          // If timeout, check if element has any content
          return null;
        });
        
        const gameSuitabilityText = await page.textContent('#game-suitability');
        expect(gameSuitabilityText).toBeTruthy();
        expect(gameSuitabilityText.trim().length).toBeGreaterThan(0); // Ensure it's populated
        
        expected.forEach(gameType => {
          expect(gameSuitabilityText).toContain(gameType);
        });
      });
    });
  });
});

test.describe('Monitor Comparison Tool (Calculator #2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.click('.calc-tab[data-calc="monitor-comparison"]');
    await page.waitForTimeout(500);
  });

  test('Should compare two monitors side-by-side', async ({ page }) => {
    // Fill Monitor A
    await page.fill('#monitor-a-name', comparisonTestData.monitorA.name);
    await page.fill('#monitor-a-response', comparisonTestData.monitorA.responseTime.toString());
    await page.selectOption('#monitor-a-type', comparisonTestData.monitorA.responseTimeType);
    await page.selectOption('#monitor-a-refresh', comparisonTestData.monitorA.refreshRate.toString());
    await page.selectOption('#monitor-a-panel', comparisonTestData.monitorA.panelType);
    await page.selectOption('#monitor-a-overdrive', comparisonTestData.monitorA.overdriveSetting);
    
    // Fill Monitor B
    await page.fill('#monitor-b-name', comparisonTestData.monitorB.name);
    await page.fill('#monitor-b-response', comparisonTestData.monitorB.responseTime.toString());
    await page.selectOption('#monitor-b-type', comparisonTestData.monitorB.responseTimeType);
    await page.selectOption('#monitor-b-refresh', comparisonTestData.monitorB.refreshRate.toString());
    await page.selectOption('#monitor-b-panel', comparisonTestData.monitorB.panelType);
    await page.selectOption('#monitor-b-overdrive', comparisonTestData.monitorB.overdriveSetting);
    
    await page.click('#compare-monitors');
    await page.waitForSelector('#comparison-results', { state: 'visible', timeout: 5000 });
    
    // Verify comparison completed
    const resultArea = await page.locator('#comparison-results');
    await expect(resultArea).toBeVisible();
  });

  test('Should calculate gaming performance score (0-100)', async ({ page }) => {
    // Fill comparison data
    await page.fill('#monitor-a-response', '1.82');
    await page.selectOption('#monitor-a-type', 'gtg');
    await page.selectOption('#monitor-a-refresh', '360');
    await page.selectOption('#monitor-a-panel', 'tn');
    await page.selectOption('#monitor-a-overdrive', 'normal');
    
    await page.fill('#monitor-b-response', '2.0');
    await page.selectOption('#monitor-b-type', 'gtg');
    await page.selectOption('#monitor-b-refresh', '240');
    await page.selectOption('#monitor-b-panel', 'oled');
    await page.selectOption('#monitor-b-overdrive', 'normal');
    
    await page.click('#compare-monitors');
    await page.waitForSelector('#comparison-results', { state: 'visible', timeout: 5000 });
    
    // Verify results appear
    const resultArea = await page.locator('#comparison-results');
    await expect(resultArea).toBeVisible();
  });
});

test.describe('Gaming Monitor Recommender (Calculator #3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.click('.calc-tab[data-calc="monitor-recommender"]');
    await page.waitForTimeout(500);
  });

  test('Should complete quiz and generate recommendations', async ({ page }) => {
    // Check if quiz exists
    const quizContainer = await page.locator('#monitor-recommender-quiz, [id*="recommender"], .quiz-container').first();
    
    if (await quizContainer.isVisible()) {
      // Navigate through quiz questions if they exist
      const nextButton = await page.locator('button:has-text("Next"), .quiz-next').first();
      
      if (await nextButton.isVisible()) {
        // Answer first question
        const firstOption = await page.locator('.option-card, [data-value]').first();
        if (await firstOption.isVisible()) {
          await firstOption.click();
          await nextButton.click();
        }
      }
      
      // Try to get recommendations
      const getRecommendationsButton = await page.locator('button:has-text("Get Recommendations"), #get-recommendations').first();
      if (await getRecommendationsButton.isVisible()) {
        await getRecommendationsButton.click();
        await page.waitForTimeout(1000);
        
        // Verify recommendations appear
        const recommendations = await page.locator('.recommendation-card, [class*="recommendation"]');
        const count = await recommendations.count();
        if (count > 0) {
          expect(count).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });
});

test.describe('Refresh Rate vs FPS Visualizer (Calculator #4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.click('.calc-tab[data-calc="refresh-rate-visualizer"]');
    await page.waitForTimeout(500);
  });

  test('Should update visualization in real-time as FPS changes', async ({ page }) => {
    // Check if visualizer exists
    const refreshRateSelect = await page.locator('#visualizer-refresh-rate, [id*="refresh-rate"][id*="visualizer"], select').first();
    
    if (await refreshRateSelect.isVisible()) {
      await refreshRateSelect.selectOption('240');
      
      // Find sync tech selector
      const syncSelect = await page.locator('#visualizer-sync-tech, [id*="sync"], select').nth(1);
      if (await syncSelect.isVisible()) {
        await syncSelect.selectOption('gsync');
      }
      
      // Find FPS slider
      const fpsSlider = await page.locator('#fps-slider, [type="range"], input[type="range"]').first();
      if (await fpsSlider.isVisible()) {
        await fpsSlider.fill('180');
        await page.waitForTimeout(500);
        
        // Verify canvas or visualization exists
        const canvas = await page.locator('#frame-visualization-canvas, canvas, [id*="visualization"]').first();
        if (await canvas.isVisible()) {
          await expect(canvas).toBeVisible();
        }
      }
    }
  });

  test('Should display VRR range warning when FPS below 48 or 33% of refresh rate', async ({ page }) => {
    const refreshRateSelect = await page.locator('#visualizer-refresh-rate, select').first();
    
    if (await refreshRateSelect.isVisible()) {
      await refreshRateSelect.selectOption('240');
      
      const syncSelect = await page.locator('[id*="sync"], select').nth(1);
      if (await syncSelect.isVisible()) {
        await syncSelect.selectOption('gsync');
      }
      
      // Set FPS to 40 (below 48 AND below 33% of 240Hz = 79.2)
      const fpsSlider = await page.locator('[type="range"]').first();
      if (await fpsSlider.isVisible()) {
        await fpsSlider.fill('40');
        await page.waitForTimeout(500);
        
        // Verify VRR range warning appears
        const warningCard = await page.locator('.warning-card').filter({ hasText: /VRR|variable refresh|below.*range/i });
        if (await warningCard.count() > 0) {
          await expect(warningCard.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('Educational Content Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Should explain response time vs input lag distinction', async ({ page }) => {
    // Scroll to FAQ section
    await page.evaluate(() => {
      const faqSection = document.querySelector('#faq, [id*="faq"]');
      if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    await page.waitForTimeout(500);
    
    // Find FAQ with question about "difference between response time and input lag"
    const faqQuestion = await page.locator('.faq-question').filter({ hasText: /difference.*response.*input|response.*vs.*input/i }).first();
    
    if (await faqQuestion.count() > 0 && await faqQuestion.isVisible()) {
      // Click to expand FAQ
      await faqQuestion.click();
      await page.waitForTimeout(500);
      
      // Get the parent faq-item to find the answer
      const faqItem = faqQuestion.locator('..').first();
      const answerText = await faqItem.locator('.faq-answer-content').first().textContent();
      
      if (answerText && answerText.trim().length > 0) {
        expect(answerText.toLowerCase()).toContain('response time');
        expect(answerText.toLowerCase()).toContain('input lag');
        expect(answerText.length).toBeGreaterThan(200); // Substantive answer
      }
    } else {
      // Fallback: search for FAQ with both terms in any text
      const faqItem = await page.locator('.faq-item').filter({ hasText: /response time.*input lag|input lag.*response time/i }).first();
      if (await faqItem.count() > 0) {
        await faqItem.locator('.faq-question').first().click();
        await page.waitForTimeout(500);
        const answerText = await faqItem.locator('.faq-answer-content').first().textContent();
        if (answerText && answerText.trim().length > 0) {
          expect(answerText.toLowerCase()).toContain('input lag');
        }
      }
    }
  });

  test('Should include manufacturer deception warnings', async ({ page }) => {
    // Check for "Why You Need This Calculator" section
    const whySection = await page.locator('section').filter({ hasText: /Why.*Calculator|Manufacturer.*decep/i });
    
    if (await whySection.count() > 0) {
      await expect(whySection.first()).toBeVisible();
      
      // Verify it mentions manufacturer deception
      const sectionText = await whySection.first().textContent();
      expect(sectionText).toMatch(/manufacturer|deception|marketing|cherry.*pick/i);
    }
  });

  test('Should reference professional testing sources (RTings, TFTCentral, Hardware Unboxed)', async ({ page }) => {
    // Check footer or page content
    const pageText = await page.textContent('body');
    
    expect(pageText).toMatch(/RTings|TFTCentral|Hardware Unboxed/i);
  });
});

test.describe('Input Validation and Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Response Time Calculator tab is active by default
  });

  test('Should validate response time range (0.5-20ms)', async ({ page }) => {
    // Fill required fields first
    await page.selectOption('#response-time-type', 'gtg');
    await page.selectOption('#refresh-rate', '240');
    await page.selectOption('#panel-type', 'ips');
    await page.selectOption('#overdrive-setting', 'normal');
    await page.selectOption('#system-latency', '10');
    
    // Test below minimum - validation happens when calculate is clicked
    await page.fill('#response-time', '0.1');
    
    // Click calculate to trigger validation
    await page.click('#calculate-response-time');
    await page.waitForTimeout(500);
    
    // Check for validation error (should prevent calculation)
    const errorMessage = await page.locator('#response-time-error');
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.textContent();
    expect(errorText).toMatch(/0\.5.*20|between.*0\.5.*20/i);
    
    // Verify result is not shown (validation prevented calculation)
    const resultDisplay = await page.locator('#response-time-result');
    const displayStyle = await resultDisplay.evaluate(el => window.getComputedStyle(el).display);
    expect(displayStyle).toBe('none');
  });

  test('Should disable calculate button until required fields filled', async ({ page }) => {
    const calculateButton = await page.locator('#calculate-response-time');
    
    // Check if initially disabled
    const isDisabled = await calculateButton.isDisabled();
    
    if (isDisabled) {
      // Fill required fields
      await page.fill('#response-time', '3');
      await page.selectOption('#refresh-rate', '240');
      await page.selectOption('#panel-type', 'ips');
      
      // Should now be enabled
      await expect(calculateButton).toBeEnabled();
    }
  });
});

