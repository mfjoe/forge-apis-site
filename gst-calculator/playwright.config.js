const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for GST Calculator Tests
 * Production-ready configuration with CI/CD support
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Test directory - current folder
  testDir: './',
  
  // Test file pattern - only run gst-calculator.spec.js
  testMatch: 'gst-calculator.spec.js',
  
  // Maximum time one test can run for (30 seconds)
  timeout: 30 * 1000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5 * 1000,
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only (2 retries on CI, 0 locally)
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,
  
  // Reporters to use
  reporter: [
    // HTML report - beautiful interactive report
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure',
    }],
    
    // List report - console output
    ['list', { 
      printSteps: true 
    }],
    
    // JSON report - for CI/CD integration
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    
    // JUnit report - for CI systems like Jenkins, GitLab CI
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }],
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:8000',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Maximum time each action such as `click()` can take
    actionTimeout: 10 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
    
    // Browser viewport
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Emulate browser locale
    locale: 'en-IN',
    
    // Emulate timezone
    timezoneId: 'Asia/Kolkata',
    
    // Emulate color scheme
    colorScheme: 'light',
    
    // User agent
    // userAgent: 'Custom User Agent String',
  },

  // Configure projects for major browsers
  projects: [
    // ============================================
    // DESKTOP BROWSERS
    // ============================================
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // ============================================
    // MOBILE BROWSERS
    // ============================================
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Pixel 5 specs: 393x851 viewport
      },
    },

    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        // iPhone 12 specs: 390x844 viewport
      },
    },

    // ============================================
    // OPTIONAL: Additional Mobile Devices
    // ============================================
    // Uncomment these to test on more devices
    
    // {
    //   name: 'iPad',
    //   use: {
    //     ...devices['iPad Pro'],
    //   },
    // },

    // {
    //   name: 'Samsung Galaxy',
    //   use: {
    //     ...devices['Galaxy S9+'],
    //   },
    // },

    // ============================================
    // OPTIONAL: Branded Browsers
    // ============================================
    // Uncomment to test on branded browsers
    
    // {
    //   name: 'Microsoft Edge',
    //   use: { 
    //     ...devices['Desktop Edge'], 
    //     channel: 'msedge' 
    //   },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: { 
    //     ...devices['Desktop Chrome'], 
    //     channel: 'chrome' 
    //   },
    // },
  ],

  // ============================================
  // WEB SERVER CONFIGURATION
  // ============================================
  // Run your local dev server before starting the tests
  webServer: {
    // Command to start the server
    command: 'python3 -m http.server 8000',
    
    // Server URL to wait for
    url: 'http://localhost:8000',
    
    // Port to use
    port: 8000,
    
    // How long to wait for the server to start (in ms)
    timeout: 120 * 1000,
    
    // Reuse existing server if available (faster for local development)
    reuseExistingServer: !process.env.CI,
    
    // Show server output in console (useful for debugging)
    stdout: 'pipe',
    stderr: 'pipe',
    
    // Environment variables for the web server
    env: {
      PORT: '8000',
    },
  },

  // ============================================
  // GLOBAL SETUP/TEARDOWN
  // ============================================
  // Uncomment if you need global setup/teardown
  
  // globalSetup: require.resolve('./global-setup.js'),
  // globalTeardown: require.resolve('./global-teardown.js'),

  // ============================================
  // OUTPUT DIRECTORIES
  // ============================================
  outputDir: 'test-results/',
  
  // Preserve output on failure for debugging
  preserveOutput: 'failures-only',

  // ============================================
  // GREP PATTERNS
  // ============================================
  // Run only tests with specific tags
  // Example: npx playwright test --grep @smoke
  // grep: /@smoke/,
  
  // Skip tests with specific tags
  // grepInvert: /@skip/,
});

