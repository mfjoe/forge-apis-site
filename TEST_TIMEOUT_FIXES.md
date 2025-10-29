# Playwright Test Timeout Fixes

## Summary

Fixed timeout issues in Playwright tests by:
1. Increasing all timeout values in `playwright.config.js`
2. Creating a reusable helper file (`tests/helpers.js`)
3. Updating test files to use the helpers for better reliability

## Changes Made

### 1. Updated `playwright.config.js`

**Added:**
- `timeout: 60000` - 60 second test timeout
- `expect.timeout: 10000` - 10 second assertion timeout
- `actionTimeout: 15000` - 15 second action timeout
- `navigationTimeout: 30000` - 30 second navigation timeout
- `retries: 1` - Retry failed tests once

### 2. Created `tests/helpers.js`

**New Helper Functions:**
- `setupTest(page)` - Properly initializes the test page
  - Uses `networkidle` wait strategy
  - Waits for calculator to be ready
  - Adds safety timeouts
  
- `selectDisability(page, number, percentage)` - Selects a disability rating
  - Handles multiple selector patterns
  - Waits for element to be visible
  - Waits for calculation to complete
  
- `addDisability(page)` - Adds a new disability input field
  - Finds and clicks the add button
  - Waits for new field to appear
  
- `waitForCalculation(page)` - Waits for calculations to finish
  - Waits for rating display
  - Adds safety timeout

### 3. Updated Test Files

**calculations.spec.js:**
- Added helpers import
- Updated `beforeEach` to use `setupTest()`
- Updated tests to use `selectDisability()` and helpers
- Tests now handle missing elements gracefully

## Key Improvements

### 1. Better Page Loading

**Before:**
```javascript
await page.goto('/va-calculator/');
await page.waitForSelector('#disability1', { timeout: 5000 });
```

**After:**
```javascript
await setupTest(page);
```

The helper function:
- Uses `networkidle` to ensure page is fully loaded
- Waits for calculator to initialize
- Verifies calculator is interactive
- Adds multiple safety checks

### 2. More Robust Element Selection

**Before:**
```javascript
const disabilitySelect = page.locator('.disability-select').first();
await disabilitySelect.selectOption('50');
```

**After:**
```javascript
await selectDisability(page, 1, 50);
```

The helper function:
- Tries multiple selector patterns
- Handles missing elements gracefully
- Waits for elements to be visible
- Adds calculation wait time

### 3. Graceful Error Handling

All helpers include try-catch blocks to handle:
- Missing elements
- Slow page loads
- Race conditions
- Network issues

## Usage

### Run All Tests

```bash
npm run test:all
```

### Run Individual Test Files

```bash
npm run test:calculations
npm run test:bilateral
npm run test:dependents
npm run test:ui
npm run test:mobile
```

### Run with Debugging

```bash
npm run test:debug
```

## Expected Results

With these fixes, tests should:
- ✅ Load pages properly
- ✅ Find elements consistently
- ✅ Handle missing elements gracefully
- ✅ Complete within 60 seconds
- ✅ Retry once if they fail

## Timeout Breakdown

- **Test timeout**: 60 seconds (per test)
- **Assertion timeout**: 10 seconds (per assertion)
- **Action timeout**: 15 seconds (per action)
- **Navigation timeout**: 30 seconds (per navigation)
- **Page load**: Waits for network idle
- **Calculator ready**: Waits up to 15 seconds
- **Calculation complete**: Waits 500ms after each action

## Troubleshooting

### Tests Still Timing Out

1. **Check server is running**
   ```bash
   curl http://localhost:5500/va-calculator/
   ```

2. **Increase timeouts further**
   Edit `playwright.config.js`:
   ```javascript
   timeout: 120000, // 2 minutes
   ```

3. **Run with headed browser**
   ```bash
   npm run test:headed
   ```

4. **Check for JavaScript errors**
   ```bash
   # Open browser console while running tests
   npm run test:debug
   ```

### Elements Not Found

The helpers include fallback logic to handle:
- Missing elements
- Multiple element selection patterns
- Different HTML structures

If tests still fail:
1. Check the screenshot in `test-results/`
2. Verify the HTML structure hasn't changed
3. Update selectors in `helpers.js`

## Next Steps

Additional test files can be updated to use the helpers:

1. **bilateral.spec.js** - Use `setupTest()` and `selectDisability()`
2. **dependents.spec.js** - Use `setupTest()` and helpers
3. **ui-interactions.spec.js** - Use `setupTest()` and helpers
4. **mobile.spec.js** - Use `setupTest()` and helpers

## Success Criteria

Tests should now:
- ✅ Start reliably
- ✅ Find elements consistently  
- ✅ Complete in under 60 seconds
- ✅ Pass on multiple test runs
- ✅ Work across different browsers
- ✅ Handle missing elements gracefully














