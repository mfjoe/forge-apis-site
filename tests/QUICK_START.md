# Quick Start Guide - VA Calculator Tests

## Prerequisites

Ensure you have Node.js and npm installed. Then:

```bash
# Install dependencies
cd ForgeApis/forge-apis-site
npm install

# Install Playwright browsers
npx playwright install
```

## Running the Calculations Tests

### Start a local server first:

```bash
# Option 1: Use Live Server extension in VS Code
# Right-click on index.html in va-calculator folder → "Open with Live Server"

# Option 2: Use a simple HTTP server
npx serve -p 5500
```

### Run the tests:

```bash
# Run all tests
npm test

# Run only the calculations tests
npm run test:calculations

# Run with visible browser (see what's happening)
npm run test:headed

# Run in interactive UI mode
npm run test:ui

# Debug a failing test
npm run test:debug
```

## What the Calculations Tests Cover

The `calculations.spec.js` file tests:

1. **Single Disability Calculation** - Verifies a 50% disability shows correct rating and payment
2. **VA Combined Rating Formula** - Tests that 50% + 30% = 70% (VA math efficiency method)
3. **Multiple Disabilities** - Validates three disability combination
4. **100% Disability Payment** - Checks 2025 payment rates are correct
5. **Annual Payment Calculation** - Ensures annual = monthly × 12
6. **Dependent Spouse** - Verifies spouse adds correct amount to payment
7. **Clear Button** - Tests that all inputs reset properly
8. **Bilateral Factor** - Checks bilateral factor calculation increases rating
9. **TDIU Checkbox** - Validates TDIU affects payment at 100% rate
10. **Mobile Sticky Bar** - Tests mobile results bar updates correctly

## Screenshots

Failed tests automatically capture screenshots in `test-results/` directory.

## Viewing Results

After running tests, view the HTML report:

```bash
npm run test:report
```

## Troubleshooting

### "Connection refused" error
- Make sure you have a local server running on port 5500
- The config expects `http://localhost:5500/va-calculator/`
- Use Live Server or run: `npx serve -p 5500`

### Tests timing out
- Increase timeout in test files if needed
- Check that the calculator is loading properly
- Run with `--headed` flag to see what's happening

### Element not found errors
- The calculator HTML structure may have changed
- Update selectors in the test files to match current HTML
- Use `page.screenshot()` to see current state

## Example Test Run

```bash
$ npm run test:calculations

Running 10 tests using 5 workers

  ✓ va-calculator/calculations.spec.js:3:5 › VA Calculator - Basic Calculations › Single 50% disability calculates correctly (2.3s)
  ✓ va-calculator/calculations.spec.js:3:5 › VA Calculator - Basic Calculations › Multiple disabilities use VA combined formula (1.8s)
  ...
  
10 passed (15.2s)
```

Happy testing!





