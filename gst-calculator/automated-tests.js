// GST Calculator Automated Test Suite
// Run this in the browser console on the calculator page

console.log("🧪 Starting GST Calculator Automated Tests...");

// Test configuration
const TEST_CASES = [
  {
    name: "Exclusive Mode - 18% Intrastate",
    amount: 1000,
    rate: 18,
    type: "intrastate",
    mode: "exclusive",
    expected: {
      original: 1000,
      gst: 180,
      total: 1180,
      cgst: 90,
      sgst: 90,
      igst: 0,
    },
  },
  {
    name: "Inclusive Mode - 18% Intrastate",
    amount: 1180,
    rate: 18,
    type: "intrastate",
    mode: "inclusive",
    expected: {
      original: 1000,
      gst: 180,
      total: 1180,
      cgst: 90,
      sgst: 90,
      igst: 0,
    },
  },
  {
    name: "Exclusive Mode - 5% Interstate",
    amount: 2000,
    rate: 5,
    type: "interstate",
    mode: "exclusive",
    expected: {
      original: 2000,
      gst: 100,
      total: 2100,
      cgst: 0,
      sgst: 0,
      igst: 100,
    },
  },
  {
    name: "Inclusive Mode - 12% Interstate",
    amount: 1120,
    rate: 12,
    type: "interstate",
    mode: "inclusive",
    expected: {
      original: 1000,
      gst: 120,
      total: 1120,
      cgst: 0,
      sgst: 0,
      igst: 120,
    },
  },
  {
    name: "Zero Amount Test",
    amount: 0,
    rate: 18,
    type: "intrastate",
    mode: "exclusive",
    expected: {
      original: 0,
      gst: 0,
      total: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    },
  },
];

// Test helper functions
function setCalculatorValues(amount, rate, type, mode) {
  // Set amount
  const amountInput = document.getElementById("amount");
  if (amountInput) {
    amountInput.value = amount;
    amountInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Set mode
  const modeButtons = document.querySelectorAll(".mode-btn");
  modeButtons.forEach((btn) => btn.classList.remove("active"));
  const modeBtn = document.querySelector(`[onclick="setMode('${mode}')"]`);
  if (modeBtn) {
    modeBtn.classList.add("active");
    window.currentMode = mode;
  }

  // Set rate
  const rateButtons = document.querySelectorAll(".rate-btn");
  rateButtons.forEach((btn) => btn.classList.remove("active"));
  const rateBtn = document.querySelector(`[onclick="setRate(${rate})"]`);
  if (rateBtn) {
    rateBtn.classList.add("active");
    window.currentRate = rate;
  }

  // Set transaction type
  const typeButtons = document.querySelectorAll(".type-btn");
  typeButtons.forEach((btn) => btn.classList.remove("active"));
  const typeBtn = document.querySelector(
    `[onclick="setTransactionType('${type}')"]`
  );
  if (typeBtn) {
    typeBtn.classList.add("active");
    window.currentTransactionType = type;
  }
}

function getCalculatorResults() {
  return {
    original: parseFloat(
      document
        .getElementById("originalAmount")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
    gst: parseFloat(
      document
        .getElementById("totalGst")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
    total: parseFloat(
      document
        .getElementById("totalAmount")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
    cgst: parseFloat(
      document
        .getElementById("cgst")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
    sgst: parseFloat(
      document
        .getElementById("sgst")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
    igst: parseFloat(
      document
        .getElementById("igst")
        ?.textContent?.replace("₹", "")
        .replace(/,/g, "") || 0
    ),
  };
}

function runCalculationTest(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);

  // Set values
  setCalculatorValues(
    testCase.amount,
    testCase.rate,
    testCase.type,
    testCase.mode
  );

  // Trigger calculation
  if (window.calculate) {
    window.calculate();
  }

  // Wait a bit for calculation to complete
  setTimeout(() => {
    const results = getCalculatorResults();
    const expected = testCase.expected;

    // Check results
    const tests = [
      {
        name: "Original Amount",
        actual: results.original,
        expected: expected.original,
      },
      { name: "Total GST", actual: results.gst, expected: expected.gst },
      { name: "Total Amount", actual: results.total, expected: expected.total },
      { name: "CGST", actual: results.cgst, expected: expected.cgst },
      { name: "SGST", actual: results.sgst, expected: expected.sgst },
      { name: "IGST", actual: results.igst, expected: expected.igst },
    ];

    let allPassed = true;
    tests.forEach((test) => {
      const tolerance = 0.01; // Allow small floating point differences
      const passed = Math.abs(test.actual - test.expected) < tolerance;
      allPassed = allPassed && passed;

      console.log(
        `${passed ? "✅" : "❌"} ${test.name}: ${test.actual} (expected: ${
          test.expected
        })`
      );
    });

    console.log(`${allPassed ? "✅ PASSED" : "❌ FAILED"}: ${testCase.name}`);
    return allPassed;
  }, 100);
}

function testCalculateAgainButton() {
  console.log("\n🧪 Testing Calculate Again Button");

  // First, perform a calculation
  setCalculatorValues(1000, 18, "intrastate", "exclusive");
  if (window.calculate) {
    window.calculate();
  }

  setTimeout(() => {
    // Check if button appears
    const calculateAgainBtn = document.getElementById("calculateAgainBtn");
    const isVisible =
      calculateAgainBtn && calculateAgainBtn.classList.contains("show");
    console.log(
      `${isVisible ? "✅" : "❌"} Calculate Again button visible: ${isVisible}`
    );

    if (isVisible && calculateAgainBtn) {
      // Test button functionality
      const initialAmount = document.getElementById("amount").value;
      calculateAgainBtn.click();

      setTimeout(() => {
        const afterReset = document.getElementById("amount").value;
        const buttonHidden = !calculateAgainBtn.classList.contains("show");
        console.log(
          `${afterReset === "" ? "✅" : "❌"} Input cleared: ${
            afterReset === ""
          }`
        );
        console.log(
          `${
            buttonHidden ? "✅" : "❌"
          } Button hidden after reset: ${buttonHidden}`
        );
      }, 100);
    }
  }, 100);
}

function testHistoryFeature() {
  console.log("\n🧪 Testing History Feature");

  // Clear existing history
  if (window.clearHistory) {
    window.clearHistory();
  }

  // Perform multiple calculations
  const calculations = [
    { amount: 1000, rate: 18, type: "intrastate", mode: "exclusive" },
    { amount: 2000, rate: 5, type: "interstate", mode: "exclusive" },
    { amount: 1500, rate: 12, type: "intrastate", mode: "inclusive" },
  ];

  calculations.forEach((calc, index) => {
    setTimeout(() => {
      setCalculatorValues(calc.amount, calc.rate, calc.type, calc.mode);
      if (window.calculate) {
        window.calculate();
      }
    }, index * 200);
  });

  // Check history after all calculations
  setTimeout(() => {
    const mobileHistory = document.getElementById("historyList");
    const desktopHistory = document.getElementById("desktopHistoryList");

    const mobileItems = mobileHistory?.querySelectorAll(".history-item") || [];
    const desktopItems =
      desktopHistory?.querySelectorAll(".history-item") || [];

    console.log(
      `${mobileItems.length > 0 ? "✅" : "❌"} Mobile history items: ${
        mobileItems.length
      }`
    );
    console.log(
      `${desktopItems.length > 0 ? "✅" : "❌"} Desktop history items: ${
        desktopItems.length
      }`
    );

    // Test clicking history item
    if (mobileItems.length > 0) {
      const firstItem = mobileItems[0];
      const initialAmount = document.getElementById("amount").value;
      firstItem.click();

      setTimeout(() => {
        const afterClick = document.getElementById("amount").value;
        console.log(
          `${
            afterClick !== initialAmount ? "✅" : "❌"
          } History item clickable: ${afterClick !== initialAmount}`
        );
      }, 100);
    }
  }, calculations.length * 200 + 500);
}

function testResponsiveDesign() {
  console.log("\n🧪 Testing Responsive Design");

  const viewportWidth = window.innerWidth;
  console.log(`📱 Current viewport: ${viewportWidth}px`);

  // Check mobile elements
  const mobileOnlyElements = document.querySelectorAll(".mobile-only");
  const desktopOnlyElements = document.querySelectorAll(".desktop-only");

  console.log(`📱 Mobile-only elements: ${mobileOnlyElements.length}`);
  console.log(`🖥️ Desktop-only elements: ${desktopOnlyElements.length}`);

  // Check ad placement
  const mobileAds = document.querySelectorAll(".ad-container.mobile-only");
  const desktopAds = document.querySelectorAll(".ad-skyscraper");

  console.log(`📱 Mobile ads: ${mobileAds.length}`);
  console.log(`🖥️ Desktop ads: ${desktopAds.length}`);

  // Check navbar height
  const navbar = document.querySelector("nav");
  const navHeight = navbar ? navbar.offsetHeight : 0;
  console.log(`📏 Navbar height: ${navHeight}px`);

  if (viewportWidth <= 768) {
    console.log(
      `${navHeight <= 60 ? "✅" : "❌"} Mobile navbar compact: ${navHeight}px`
    );
  } else {
    console.log(
      `${
        navHeight <= 100 ? "✅" : "❌"
      } Desktop navbar appropriate: ${navHeight}px`
    );
  }
}

function testPerformance() {
  console.log("\n🧪 Testing Performance");

  // Check for JavaScript errors
  const originalError = console.error;
  let errorCount = 0;
  console.error = function (...args) {
    errorCount++;
    originalError.apply(console, args);
  };

  // Test calculation speed
  const startTime = performance.now();
  setCalculatorValues(1000, 18, "intrastate", "exclusive");
  if (window.calculate) {
    window.calculate();
  }
  const endTime = performance.now();
  const calculationTime = endTime - startTime;

  console.log(
    `${
      calculationTime < 100 ? "✅" : "❌"
    } Calculation speed: ${calculationTime.toFixed(2)}ms`
  );
  console.log(
    `${errorCount === 0 ? "✅" : "❌"} JavaScript errors: ${errorCount}`
  );

  // Restore original error handler
  console.error = originalError;
}

function runAllTests() {
  console.log("🚀 Running All GST Calculator Tests...\n");

  let passedTests = 0;
  let totalTests = 0;

  // Run calculation tests
  TEST_CASES.forEach((testCase) => {
    totalTests++;
    const passed = runCalculationTest(testCase);
    if (passed) passedTests++;
  });

  // Run feature tests
  setTimeout(() => {
    testCalculateAgainButton();
    testHistoryFeature();
    testResponsiveDesign();
    testPerformance();

    // Final summary
    setTimeout(() => {
      console.log("\n📊 Test Summary:");
      console.log(`✅ Passed: ${passedTests}/${totalTests} calculation tests`);
      console.log("🔍 Check individual test results above for feature tests");
      console.log(
        "💡 For complete testing, also test manually on different devices"
      );
    }, 2000);
  }, 1000);
}

// Auto-run tests when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAllTests);
} else {
  runAllTests();
}

// Export functions for manual testing
window.gstCalculatorTests = {
  runAllTests,
  runCalculationTest,
  testCalculateAgainButton,
  testHistoryFeature,
  testResponsiveDesign,
  testPerformance,
};

console.log("💡 Manual test commands available:");
console.log("- gstCalculatorTests.runAllTests()");
console.log("- gstCalculatorTests.testCalculateAgainButton()");
console.log("- gstCalculatorTests.testHistoryFeature()");
console.log("- gstCalculatorTests.testResponsiveDesign()");
console.log("- gstCalculatorTests.testPerformance()");
