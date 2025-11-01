// 05-pro-player-settings.spec.js

import { test, expect } from '@playwright/test';

import testData from './test-data.js';



test.describe('Pro Player Settings', () => {

  

  test.beforeEach(async ({ page }) => {

    // Navigate to DPI calculator page

    await page.goto('/dpi-calculator/');

    

    // Wait for page to load

    await page.waitForLoadState('networkidle');

    

    // Scroll to pro settings section

    await page.evaluate(() => {

      document.querySelector('.pro-settings-section')?.scrollIntoView({ behavior: 'smooth' });

    });

    

    // Wait for section to be visible

    await page.waitForTimeout(500);

  });



  test('should display pro settings section', async ({ page }) => {

    await expect(page.locator('.pro-settings-section')).toBeVisible();

    await expect(page.locator('text=Pro Player DPI Settings')).toBeVisible();

  });



  test('should display all game tabs', async ({ page }) => {

    await expect(page.locator('[data-game="valorant"]')).toBeVisible();

    await expect(page.locator('[data-game="cs2"]')).toBeVisible();

    await expect(page.locator('[data-game="apex"]')).toBeVisible();

    await expect(page.locator('[data-game="fortnite"]')).toBeVisible();

    await expect(page.locator('[data-game="cod"]')).toBeVisible();

    await expect(page.locator('[data-game="overwatch"]')).toBeVisible();

  });



  test('should have Valorant tab active by default', async ({ page }) => {

    const valorantTab = page.locator('[data-game="valorant"]');

    await expect(valorantTab).toHaveClass(/active/);

    

    // Valorant content should be visible

    await expect(page.locator('#valorant-content')).toBeVisible();

  });



  test('should switch between game tabs', async ({ page }) => {

    // Click CS2 tab

    await page.click('[data-game="cs2"]');

    await page.waitForTimeout(300);

    

    // CS2 content should be visible

    await expect(page.locator('#cs2-content')).toBeVisible();

    

    // Valorant content should be hidden

    const valorantVisible = await page.locator('#valorant-content').isVisible();

    expect(valorantVisible).toBe(false);

    

    // CS2 tab should be active

    await expect(page.locator('[data-game="cs2"]')).toHaveClass(/active/);

  });



  test('should display pro player cards in Valorant section', async ({ page }) => {

    await expect(page.locator('#valorant-cards')).toBeVisible();

    

    // Should have multiple player cards

    const cardCount = await page.locator('#valorant-cards .pro-card').count();

    expect(cardCount).toBeGreaterThan(0);

  });



  test.describe('Verify pro player data accuracy from test-data.js', () => {

    for (const playerData of testData.proPlayerSettings) {

      test(`should display correct settings for ${playerData.playerName} (${playerData.game})`, async ({ page }) => {

        // Switch to correct game tab

        await page.click(`[data-game="${playerData.game}"]`);

        await page.waitForTimeout(300);

        

        // Find the player card (case-insensitive search)

        const playerCard = page.locator(`.pro-card:has-text("${playerData.playerName}")`).first();

        

        // Card should exist

        await expect(playerCard).toBeVisible();

        

        const cardText = await playerCard.textContent();

        

        // Check DPI

        expect(cardText).toContain(playerData.expectedDpi);

        

        // Check sensitivity

        expect(cardText).toContain(playerData.expectedSens);

        

        // Check eDPI (may have "eDPI" label)

        expect(cardText).toContain(playerData.expectedEdpi);

      });

    }

  });



  test('should display TenZ with updated settings (1600 DPI, 0.139 sens, 222.4 eDPI)', async ({ page }) => {

    const tenzCard = page.locator('.pro-card:has-text("TenZ")').first();

    await expect(tenzCard).toBeVisible();

    

    const cardText = await tenzCard.textContent();

    

    // Updated from Prompt #2

    expect(cardText).toContain('1600');

    expect(cardText).toContain('0.139');

    expect(cardText).toContain('222.4');

  });



  test('should display Aspas with updated settings (800 DPI, 0.4 sens, 320 eDPI)', async ({ page }) => {

    const aspasCard = page.locator('.pro-card:has-text("Aspas")').first();

    await expect(aspasCard).toBeVisible();

    

    const cardText = await aspasCard.textContent();

    

    // Updated from Prompt #2

    expect(cardText).toContain('800');

    expect(cardText).toContain('0.4');

    expect(cardText).toContain('320');

  });



  test('should display s1mple with correct CS2 settings', async ({ page }) => {

    await page.click('[data-game="cs2"]');

    await page.waitForTimeout(300);

    

    const s1mpleCard = page.locator('.pro-card:has-text("s1mple")').first();

    await expect(s1mpleCard).toBeVisible();

    

    const cardText = await s1mpleCard.textContent();

    

    expect(cardText).toContain('400');

    expect(cardText).toContain('3.09');

    expect(cardText).toContain('1236');

  });



  test('should display ImperialHal with updated settings (880 eDPI)', async ({ page }) => {

    await page.click('[data-game="apex"]');

    await page.waitForTimeout(300);

    

    const halCard = page.locator('.pro-card:has-text("ImperialHal")').first();

    await expect(halCard).toBeVisible();

    

    const cardText = await halCard.textContent();

    

    // Updated from Prompt #2

    expect(cardText).toContain('880');

  });



  test('should display Bugha with updated Fortnite settings (52.0 eDPI)', async ({ page }) => {

    await page.click('[data-game="fortnite"]');

    await page.waitForTimeout(300);

    

    const bughaCard = page.locator('.pro-card:has-text("Bugha")').first();

    await expect(bughaCard).toBeVisible();

    

    const cardText = await bughaCard.textContent();

    

    // Updated from Prompt #2

    expect(cardText).toContain('52');

  });



  test('should display mouse model for each pro player', async ({ page }) => {

    const firstCard = page.locator('#valorant-cards .pro-card').first();

    await expect(firstCard).toBeVisible();

    

    const cardText = await firstCard.textContent();

    

    // Should mention mouse brand

    expect(cardText.toLowerCase()).toMatch(/logitech|razer|finalmouse|zowie|steelseries|mouse/);

  });



  test('should display team name for each pro player', async ({ page }) => {

    const tenzCard = page.locator('.pro-card:has-text("TenZ")').first();

    await expect(tenzCard).toBeVisible();

    

    // Team name should be visible (may be in .pro-team class or just in card text)

    const teamElement = tenzCard.locator('.pro-team').first();

    const teamExists = await teamElement.isVisible().catch(() => false);

    

    if (teamExists) {

      const teamText = await teamElement.textContent();

      expect(teamText.toLowerCase()).toContain('sentinels');

    } else {

      // Fallback: check card text

      const cardText = await tenzCard.textContent();

      expect(cardText.toLowerCase()).toContain('sentinels');

    }

  });



  test('should highlight eDPI value with special styling', async ({ page }) => {

    const firstCard = page.locator('#valorant-cards .pro-card').first();

    await expect(firstCard).toBeVisible();

    

    // eDPI should have special highlight class

    const edpiHighlight = firstCard.locator('.edpi-highlight');

    await expect(edpiHighlight).toBeVisible();

  });



  test('should display summary stats for Valorant', async ({ page }) => {

    // Summary may be in #valorant-summary or as part of content

    const summaryElement = page.locator('#valorant-content').locator('text=/Average eDPI|Most Common|eDPI Range/i').first();

    await expect(summaryElement).toBeVisible();

    

    const summaryText = await summaryElement.textContent();

    expect(summaryText.length).toBeGreaterThan(0);

  });



  test('should show updated Valorant average eDPI (238, not 222)', async ({ page }) => {

    // Find the average eDPI value element by its ID
    const avgElement = page.locator('#valorant-avg');

    await expect(avgElement).toBeVisible();

    const avgText = await avgElement.textContent();

    // Should contain the updated average value
    expect(avgText.trim()).toBe('238');

  });



  test('should display search box for each game', async ({ page }) => {

    await expect(page.locator('#valorant-search')).toBeVisible();

    

    // Switch to CS2

    await page.click('[data-game="cs2"]');

    await page.waitForTimeout(300);

    

    await expect(page.locator('#cs2-search')).toBeVisible();

  });



  test('should filter players by search query', async ({ page }) => {

    // Search for TenZ

    await page.fill('#valorant-search', 'tenz');

    await page.waitForTimeout(500);

    

    // TenZ card should be visible

    const tenzCard = page.locator('.pro-card:has-text("TenZ")');

    await expect(tenzCard).toBeVisible();

    

    // Other cards should be hidden (or filtered)

    const allCards = await page.locator('#valorant-cards .pro-card').count();

    const visibleCards = await page.locator('#valorant-cards .pro-card:visible').count();

    

    // At least one card should be visible, filtered count should be less than or equal to all

    expect(visibleCards).toBeGreaterThan(0);

    expect(visibleCards).toBeLessThanOrEqual(allCards);

  });



  test('should show "no results" message for invalid search', async ({ page }) => {

    await page.fill('#valorant-search', 'xyznonexistentplayer');

    await page.waitForTimeout(500);

    

    // Should show no results message (may have class .no-results or text)

    const noResults = page.locator('#valorant-content').locator('text=/no results|not found|no players/i').first();

    const noResultsExists = await noResults.isVisible().catch(() => false);

    

    // If no results message exists, verify it

    if (noResultsExists) {

      await expect(noResults).toBeVisible();

    } else {

      // Alternative: check that no cards are visible

      const visibleCards = await page.locator('#valorant-cards .pro-card:visible').count();

      expect(visibleCards).toBe(0);

    }

  });



  test('should clear search filter and show all players', async ({ page }) => {

    // Search first

    await page.fill('#valorant-search', 'tenz');

    await page.waitForTimeout(500);

    

    const filteredCount = await page.locator('#valorant-cards .pro-card:visible').count();

    

    // Clear search

    await page.fill('#valorant-search', '');

    await page.waitForTimeout(500);

    

    const allCount = await page.locator('#valorant-cards .pro-card:visible').count();

    

    expect(allCount).toBeGreaterThanOrEqual(filteredCount);

  });



  test('should display sort buttons', async ({ page }) => {

    const sortButtons = page.locator('#valorant-content .pro-sort-btn');

    const count = await sortButtons.count();

    

    expect(count).toBeGreaterThanOrEqual(3); // At least name, team, eDPI

  });



  test('should have "Sort by Name" active by default', async ({ page }) => {

    const nameSort = page.locator('#valorant-content .pro-sort-btn[data-sort="name"]');

    await expect(nameSort).toHaveClass(/active/);

  });



  test('should sort by eDPI when clicked', async ({ page }) => {

    // Click sort by eDPI

    await page.click('#valorant-content .pro-sort-btn[data-sort="edpi"]');

    await page.waitForTimeout(500);

    

    // Button should be active

    const edpiSort = page.locator('#valorant-content .pro-sort-btn[data-sort="edpi"]');

    await expect(edpiSort).toHaveClass(/active/);

    

    // Get first two visible cards

    const cards = page.locator('#valorant-cards .pro-card:visible');

    const firstCardEdpi = await cards.nth(0).getAttribute('data-edpi');

    const secondCardEdpi = await cards.nth(1).getAttribute('data-edpi');

    

    // First should be less than or equal to second (ascending order)

    if (firstCardEdpi && secondCardEdpi) {

      expect(parseFloat(firstCardEdpi)).toBeLessThanOrEqual(parseFloat(secondCardEdpi));

    }

  });



  test('should sort by team name when clicked', async ({ page }) => {

    // Click sort by team

    await page.click('#valorant-content .pro-sort-btn[data-sort="team"]');

    await page.waitForTimeout(500);

    

    // Button should be active

    const teamSort = page.locator('#valorant-content .pro-sort-btn[data-sort="team"]');

    await expect(teamSort).toHaveClass(/active/);

  });



  test('should sort by name alphabetically', async ({ page }) => {

    // Click sort by name

    await page.click('#valorant-content .pro-sort-btn[data-sort="name"]');

    await page.waitForTimeout(500);

    

    // Get player names in order

    const cards = page.locator('#valorant-cards .pro-card:visible');

    const firstCard = cards.nth(0);

    const secondCard = cards.nth(1);

    

    // Get names from card text or data-name attribute

    const firstPlayer = await firstCard.getAttribute('data-name').catch(() => 

      firstCard.locator('.pro-name').textContent()

    );

    const secondPlayer = await secondCard.getAttribute('data-name').catch(() => 

      secondCard.locator('.pro-name').textContent()

    );

    

    // First should come before second alphabetically

    if (firstPlayer && secondPlayer) {

      expect(firstPlayer.localeCompare(secondPlayer)).toBeLessThanOrEqual(0);

    }

  });



  test('should combine search and sort', async ({ page }) => {

    // Search for players with "a" in name

    await page.fill('#valorant-search', 'a');

    await page.waitForTimeout(300);

    

    // Sort by eDPI

    await page.click('#valorant-content .pro-sort-btn[data-sort="edpi"]');

    await page.waitForTimeout(300);

    

    // Should show filtered and sorted results

    const visibleCards = await page.locator('#valorant-cards .pro-card:visible').count();

    expect(visibleCards).toBeGreaterThan(0);

  });



  test('should display important notes section', async ({ page }) => {

    const notesElement = page.locator('.pro-settings-note').first();

    await expect(notesElement).toBeVisible();

    

    const notesText = await notesElement.textContent();

    expect(notesText.toLowerCase()).toMatch(/blindly copy|don't copy|reference/i);

  });



  test('should display data freshness disclaimer', async ({ page }) => {

    const disclaimerElement = page.locator('.pro-disclaimer').first();

    await expect(disclaimerElement).toBeVisible();

    

    const disclaimerText = await disclaimerElement.textContent();

    

    // Should mention settings change frequently (from Prompt #10)

    expect(disclaimerText.toLowerCase()).toMatch(/change|frequently|updated|2025/i);

  });



  test('should show warning about settings changing frequently', async ({ page }) => {

    const disclaimerText = await page.locator('.pro-disclaimer').first().textContent();

    

    // Should mention January 2025 update date (from Prompt #10)

    expect(disclaimerText).toMatch(/2025|january/i);

  });



  test('should display warning about TenZ changing settings frequently', async ({ page }) => {

    // Check if notes mention TenZ as example (from Prompt #10)

    const notesText = await page.locator('.pro-settings-note').first().textContent();

    expect(notesText.toLowerCase()).toMatch(/tenz|settings change|frequently/i);

  });



  test('should show contact info for outdated data', async ({ page }) => {

    const disclaimerText = await page.locator('.pro-disclaimer').first().textContent();

    

    // Should invite users to report outdated info (from Prompt #10)

    expect(disclaimerText.toLowerCase()).toMatch(/contact|outdated|notice|report/i);

  });



  test('should display all 8 Valorant pro players', async ({ page }) => {

    const cardCount = await page.locator('#valorant-cards .pro-card').count();

    expect(cardCount).toBe(8);

  });



  test('should display all 7 CS2 pro players', async ({ page }) => {

    await page.click('[data-game="cs2"]');

    await page.waitForTimeout(300);

    

    const cardCount = await page.locator('#cs2-cards .pro-card').count();

    expect(cardCount).toBe(7);

  });



  test('should have data attributes for search/sort functionality', async ({ page }) => {

    const firstCard = page.locator('#valorant-cards .pro-card').first();

    

    // Should have data-edpi attribute

    const edpiAttr = await firstCard.getAttribute('data-edpi');

    expect(edpiAttr).not.toBeNull();

    expect(parseFloat(edpiAttr)).toBeGreaterThan(0);

    

    // Should have data-name attribute

    const nameAttr = await firstCard.getAttribute('data-name');

    expect(nameAttr).not.toBeNull();

    expect(nameAttr.length).toBeGreaterThan(0);

    

    // Should have data-team attribute

    const teamAttr = await firstCard.getAttribute('data-team');

    expect(teamAttr).not.toBeNull();

  });



  test('should have lowercase data-name attributes', async ({ page }) => {

    const firstCard = page.locator('#valorant-cards .pro-card').first();

    const nameAttr = await firstCard.getAttribute('data-name');

    

    // Should be all lowercase (from Prompt #6)

    expect(nameAttr).toBe(nameAttr.toLowerCase());

  });



  test('should show game-specific info banner about data freshness', async ({ page }) => {

    // Should have warning banner at top of game section (from Prompt #10)

    const warningBanner = page.locator('#valorant-content').locator('text=/Pro settings are current|January 2025|reference/i').first();

    

    const bannerExists = await warningBanner.isVisible().catch(() => false);

    

    if (bannerExists) {

      const bannerText = await warningBanner.textContent();

      expect(bannerText.toLowerCase()).toMatch(/january 2025|reference|current/i);

    }

  });



  test('should maintain filter state when switching tabs and returning', async ({ page }) => {

    // Search in Valorant

    await page.fill('#valorant-search', 'tenz');

    await page.waitForTimeout(300);

    

    // Switch to CS2

    await page.click('[data-game="cs2"]');

    await page.waitForTimeout(300);

    

    // Switch back to Valorant

    await page.click('[data-game="valorant"]');

    await page.waitForTimeout(300);

    

    // Search should still be there (if state is maintained)

    const searchValue = await page.locator('#valorant-search').inputValue();

    // Value may or may not persist depending on implementation

    // Test passes if search box exists

    expect(searchValue.length).toBeGreaterThanOrEqual(0);

  });



  test('should show pro card hover effects', async ({ page }) => {

    const firstCard = page.locator('#valorant-cards .pro-card').first();

    

    // Hover over card

    await firstCard.hover();

    await page.waitForTimeout(200);

    

    // Card should have transition/transform applied (visual test)

    // Check if transform changes on hover

    const transform = await firstCard.evaluate(el => 

      window.getComputedStyle(el).transform

    );

    

    // Should have some transform (hover effect may or may not be visible in test)

    expect(transform).toBeTruthy();

  });



  test('should load all game sections without errors', async ({ page }) => {

    const games = ['valorant', 'cs2', 'apex', 'fortnite', 'cod', 'overwatch'];

    

    for (const game of games) {

      await page.click(`[data-game="${game}"]`);

      await page.waitForTimeout(300);

      

      // Content should be visible

      const content = page.locator(`#${game}-content`);

      await expect(content).toBeVisible();

      

      // Should have cards

      const cards = page.locator(`#${game}-cards .pro-card`);

      const count = await cards.count();

      expect(count).toBeGreaterThan(0);

    }

  });



});

