# VA Calculator Playwright Tests

This directory contains end-to-end tests for the VA Disability Benefits Calculator using Playwright.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install
```

Or use the npm script:
```bash
npm run install-browsers
```

3. **Start your local server:**
```bash
# The Playwright config expects a server on http://localhost:5500
# You can start one with:
npx serve -p 5500
# Or use Live Server extension in VS Code
```

## Running Tests

### Run all test suites with comprehensive reporting:
```bash
npm run test:all
```

This will run all 5 test suites sequentially and generate an HTML report.

### Run individual test suites:
```bash
npm test                                          # Run all tests with Playwright
npm run test:calculations                        # Calculations only
npm run test:bilateral                           # Bilateral factor only
npm run test:dependents                          # Dependents only
npm run test:ui                                  # UI interactions only
npm run test:mobile                              # Mobile layout only
```

### Run tests in headed mode (see the browser):
```bash
npm run test:headed
```

### Run tests with UI mode:
```bash
npm run test:uimode
```

### Run tests in debug mode:
```bash
npm run test:debug
```

## Test Coverage

### Main Test Suite (`va-calculator.spec.js`)
- Calculator initialization and loading
- Single and multiple disability rating calculations
- Combined rating calculations
- Payment calculations and breakdown display
- Dependent adjustments (spouse, children, parents)
- TDIU (Total Disability Individual Unemployability) functionality
- Bilateral factor calculations
- Save and load functionality
- Clear all inputs
- Mobile responsive design
- FAQ section accessibility
- Mobile sticky results bar

### Calculations Test Suite (`calculations.spec.js`)
- Single 50% disability calculation
- VA combined rating formula (50% + 30% = 70%)
- Three disability calculations
- 100% disability payment verification
- Annual payment = monthly × 12 validation
- Dependent spouse adjustments
- Bilateral factor application
- TDIU checkbox functionality
- Clear button reset behavior
- Mobile sticky results bar updates

### Bilateral Factor Test Suite (`bilateral.spec.js`)
- Bilateral factor 10% bonus calculation
- Multiple bilateral disabilities on same side
- Non-bilateral disabilities (no bonus)
- Multiple bilateral disabilities
- Bilateral explanation text display
- Bilateral checkbox toggle functionality
- Bilateral factor with TDIU
- Mobile view bilateral handling

### Dependents Test Suite (`dependents.spec.js`)
- Married dependent increases payment (30% rating and higher)
- Children under 18 increase payment
- Dependents do not affect payment below 30%
- Spouse aid and attendance increase
- Children 18-23 in school add payment
- Parent dependents (one or two) increase payment
- Combined dependents calculate correctly
- Dependent amounts display in breakdown
- Unchecking dependents removes additions
- Mobile view handles dependents correctly
- Annual payment reflects all dependents

### UI Interactions Test Suite (`ui-interactions.spec.js`)
- Add disability button creates new input fields
- Remove disability button removes fields
- Clear all button resets the calculator
- TDIU section appears when eligible (70% rating)
- Path to 100% section shows for 70-94% ratings
- Path to 100% hidden for 100% rating
- Payment breakdown shows base rate and dependents
- Disability dropdown has all standard options
- Results update dynamically as inputs change
- Mobile sticky bar appears on mobile devices
- FAQ items expand and collapse
- Print/save functionality works
- All tabs/panels are accessible
- Form validates input correctly (no negative numbers)
- Responsive design works on tablet viewport

### Mobile Layout Test Suite (`mobile.spec.js`)
- Breadcrumb hidden on mobile devices
- Mobile sticky results bar appears and updates correctly
- Mobile tab dropdown navigation works
- Touch targets meet 44px minimum (accessibility)
- Collapsible sections expand and collapse
- Footer is minimal on mobile
- Input fields have proper mobile styling (16px font prevents zoom)
- Results section scrolls into view
- Mobile header displays correctly
- Disability inputs are accessible
- Spacing is appropriate for touch
- Text is readable (14px+ font size)
- Keyboard navigation works
- Page does not overflow horizontally

## Test Runner

The `run-all-tests.js` script provides a comprehensive test runner that:
- Runs all 5 test suites sequentially
- Displays progress for each suite
- Shows summary statistics (total, passed, failed, duration)
- Generates an HTML report in `test-results/report.html`
- Exits with error code 1 if any tests fail (for CI/CD)

### Usage

```bash
npm run test:all
```

This command will:
1. Run all test suites one by one
2. Show real-time progress
3. Display final summary
4. Generate HTML report
5. Exit with appropriate status code

The HTML report includes:
- Overall statistics (total, passed, failed, duration, success rate)
- Per-suite breakdown with emojis
- Status indicators (✅ passed, ⚠️ warnings)
- Generated timestamp

## Configuration

Tests run against `http://localhost:5500` by default. To change the base URL, edit `playwright.config.js`.

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Troubleshooting

- Make sure you have a local server running on port 5500 (or update the baseURL in the config)
- If tests fail, check the screenshots in `test-results/` directory
- Use `--headed` mode to see the browser while tests run
- Use `--debug` mode to step through tests interactively

