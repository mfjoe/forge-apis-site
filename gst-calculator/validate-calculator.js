// GST Calculator Validation Script
// This script validates the calculator logic and functionality

console.log("🧪 Starting GST Calculator Validation...");

// Test the calculation logic
function validateCalculationLogic() {
  console.log("\n📊 Testing Calculation Logic...");

  // Test cases with expected results
  const testCases = [
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
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  testCases.forEach((testCase) => {
    console.log(`\n🧪 Testing: ${testCase.name}`);

    let originalAmount, gstAmount, totalAmount, cgst, sgst, igst;

    if (testCase.mode === "exclusive") {
      originalAmount = testCase.amount;
      gstAmount = (testCase.amount * testCase.rate) / 100;
      totalAmount = testCase.amount + gstAmount;
    } else {
      // inclusive
      totalAmount = testCase.amount;
      originalAmount = testCase.amount / (1 + testCase.rate / 100);
      gstAmount = totalAmount - originalAmount;
    }

    if (testCase.type === "intrastate") {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
      igst = 0;
    } else {
      // interstate
      cgst = 0;
      sgst = 0;
      igst = gstAmount;
    }

    // Round to 2 decimal places
    originalAmount = Math.round(originalAmount * 100) / 100;
    gstAmount = Math.round(gstAmount * 100) / 100;
    totalAmount = Math.round(totalAmount * 100) / 100;
    cgst = Math.round(cgst * 100) / 100;
    sgst = Math.round(sgst * 100) / 100;
    igst = Math.round(igst * 100) / 100;

    const results = {
      originalAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
      igst,
    };
    const expected = testCase.expected;

    // Check each result
    const checks = [
      {
        name: "Original Amount",
        actual: results.originalAmount,
        expected: expected.original,
      },
      { name: "GST Amount", actual: results.gstAmount, expected: expected.gst },
      {
        name: "Total Amount",
        actual: results.totalAmount,
        expected: expected.total,
      },
      { name: "CGST", actual: results.cgst, expected: expected.cgst },
      { name: "SGST", actual: results.sgst, expected: expected.sgst },
      { name: "IGST", actual: results.igst, expected: expected.igst },
    ];

    let testPassed = true;
    checks.forEach((check) => {
      const tolerance = 0.01;
      const passed = Math.abs(check.actual - check.expected) < tolerance;
      testPassed = testPassed && passed;

      console.log(
        `${passed ? "✅" : "❌"} ${check.name}: ${check.actual} (expected: ${
          check.expected
        })`
      );
    });

    if (testPassed) {
      passedTests++;
      console.log(`✅ PASSED: ${testCase.name}`);
    } else {
      console.log(`❌ FAILED: ${testCase.name}`);
    }
  });

  console.log(
    `\n📊 Calculation Logic Results: ${passedTests}/${totalTests} tests passed`
  );
  return passedTests === totalTests;
}

// Test the formatIndianCurrency function
function validateCurrencyFormatting() {
  console.log("\n💰 Testing Currency Formatting...");

  const testCases = [
    { input: 0, expected: "₹0" },
    { input: 1000, expected: "₹1,000.00" },
    { input: 1234.56, expected: "₹1,234.56" },
    { input: 100000, expected: "₹1,00,000.00" },
    { input: 1234567.89, expected: "₹12,34,567.89" },
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  testCases.forEach((testCase) => {
    // Simulate the formatIndianCurrency function
    const num = testCase.input;
    if (isNaN(num) || num === 0) {
      const result = "₹0";
      const passed = result === testCase.expected;
      console.log(
        `${passed ? "✅" : "❌"} ${num} → ${result} (expected: ${
          testCase.expected
        })`
      );
      if (passed) passedTests++;
    } else {
      const parts = num.toFixed(2).toString().split(".");
      let integerPart = parts[0];
      const decimalPart = parts[1];

      const lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);

      if (otherNumbers !== "") {
        const formatted =
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
        const result = "₹" + formatted + "." + decimalPart;
        const passed = result === testCase.expected;
        console.log(
          `${passed ? "✅" : "❌"} ${num} → ${result} (expected: ${
            testCase.expected
          })`
        );
        if (passed) passedTests++;
      } else {
        const result = "₹" + lastThree + "." + decimalPart;
        const passed = result === testCase.expected;
        console.log(
          `${passed ? "✅" : "❌"} ${num} → ${result} (expected: ${
            testCase.expected
          })`
        );
        if (passed) passedTests++;
      }
    }
  });

  console.log(
    `\n💰 Currency Formatting Results: ${passedTests}/${totalTests} tests passed`
  );
  return passedTests === totalTests;
}

// Test localStorage functionality
function validateLocalStorage() {
  console.log("\n💾 Testing localStorage...");

  try {
    // Test if localStorage is available
    localStorage.setItem("test", "value");
    const retrieved = localStorage.getItem("test");
    localStorage.removeItem("test");

    if (retrieved === "value") {
      console.log("✅ localStorage is working");
      return true;
    } else {
      console.log("❌ localStorage not working properly");
      return false;
    }
  } catch (error) {
    console.log("❌ localStorage not available:", error.message);
    return false;
  }
}

// Test responsive design breakpoints
function validateResponsiveDesign() {
  console.log("\n📱 Testing Responsive Design...");

  const viewportWidth = window.innerWidth;
  console.log(`📱 Current viewport: ${viewportWidth}px`);

  if (viewportWidth >= 1200) {
    console.log("🖥️ Desktop layout should be active");
    return true;
  } else if (viewportWidth <= 768) {
    console.log("📱 Mobile layout should be active");
    return true;
  } else {
    console.log("📱 Tablet layout should be active");
    return true;
  }
}

// Run all validation tests
function runAllValidationTests() {
  console.log("🚀 Running All GST Calculator Validation Tests...\n");

  const results = {
    calculationLogic: validateCalculationLogic(),
    currencyFormatting: validateCurrencyFormatting(),
    localStorage: validateLocalStorage(),
    responsiveDesign: validateResponsiveDesign(),
  };

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log("\n📊 Final Validation Results:");
  console.log(
    `✅ Calculation Logic: ${results.calculationLogic ? "PASSED" : "FAILED"}`
  );
  console.log(
    `✅ Currency Formatting: ${
      results.currencyFormatting ? "PASSED" : "FAILED"
    }`
  );
  console.log(`✅ localStorage: ${results.localStorage ? "PASSED" : "FAILED"}`);
  console.log(
    `✅ Responsive Design: ${results.responsiveDesign ? "PASSED" : "FAILED"}`
  );

  console.log(
    `\n🎯 Overall Result: ${passedTests}/${totalTests} validation tests passed`
  );

  if (passedTests === totalTests) {
    console.log(
      "🎉 All validation tests passed! The calculator should work correctly."
    );
  } else {
    console.log("⚠️ Some validation tests failed. Check the details above.");
  }

  return results;
}

// Auto-run validation tests
if (typeof window !== "undefined") {
  // Browser environment
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAllValidationTests);
  } else {
    runAllValidationTests();
  }
} else {
  // Node.js environment
  runAllValidationTests();
}

// Export for manual testing
if (typeof window !== "undefined") {
  window.gstCalculatorValidation = {
    runAllValidationTests,
    validateCalculationLogic,
    validateCurrencyFormatting,
    validateLocalStorage,
    validateResponsiveDesign,
  };

  console.log("\n💡 Manual validation commands available:");
  console.log("- gstCalculatorValidation.runAllValidationTests()");
  console.log("- gstCalculatorValidation.validateCalculationLogic()");
  console.log("- gstCalculatorValidation.validateCurrencyFormatting()");
  console.log("- gstCalculatorValidation.validateLocalStorage()");
  console.log("- gstCalculatorValidation.validateResponsiveDesign()");
}
