# DPI Calculator Test Suite

Comprehensive Playwright tests for the DPI Calculator tool.

## Installation

```bash
cd ForgeApis/forge-apis-site
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm run test:dpi

# Run tests with browser visible
npm run test:dpi:headed

# Debug tests
npm run test:dpi:debug

# Run tests in UI mode
npm run test:dpi:ui

# View last test report
npm run test:dpi:report

# Run specific browser
npm run test:dpi:chrome

# Run mobile tests
npm run test:dpi:mobile
```

## Test Structure

- `/e2e/dpi-calculator.spec.js` - Main test suite
- `/e2e/test-data.js` - Test fixtures and expected values
- `/e2e/playwright.config.js` - Playwright configuration for DPI calculator tests

## What's Tested

1. eDPI Calculator accuracy
2. cm/360 Calculator accuracy
3. Sensitivity Analyzer logic
4. DPI Comparison tool
5. Pro player settings data
6. Mobile responsiveness
7. Tab navigation
8. Input validation
9. Error handling
10. Share functionality

## Test Configuration

The tests use a local Python HTTP server on port 8080. The configuration automatically starts the server before running tests.

To run tests manually:

```bash
# Terminal 1: Start server
cd ForgeApis/forge-apis-site/dpi-calculator
python -m http.server 8080

# Terminal 2: Run tests
cd ForgeApis/forge-apis-site
npx playwright test tests/e2e/dpi-calculator.spec.js --config=tests/e2e/playwright.config.js
```

## Browser Support

Tests run on:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Data

Test fixtures are located in `tests/e2e/test-data.js` and include:
- eDPI calculator test cases
- cm/360 calculator test cases
- Sensitivity analyzer test cases
- DPI comparison test cases
- Pro player settings verification data
- Viewport sizes for responsive testing
