// Create a new file: cod-points-calculator-tests.js

// ========== TEST SUITE FOR COD POINTS CALCULATOR ==========

console.log("Starting COD Points Calculator Tests...\n");

let testsPassed = 0;
let testsFailed = 0;

// Helper function
function test(description, actual, expected) {
  if (Math.abs(actual - expected) < 0.01) {
    console.log(`✅ ${description}`);
    console.log(`   Expected: ${expected}, Got: ${actual}`);
    testsPassed++;
  } else {
    console.error(`❌ ${description}`);
    console.error(`   Expected: ${expected}, Got: ${actual}`);
    testsFailed++;
  }
}

// ========== CONVERSION RATE TESTS ==========
console.log("\n=== CONVERSION RATE TESTS ===");

const COD_RATE = 9.99 / 1100; // $0.00908 per COD Point

// Test basic conversion
test("1100 COD Points = $9.99", 1100 * COD_RATE, 9.99);
test("1000 COD Points (Battle Pass)", 1000 * COD_RATE, 9.08);
test("100 COD Points", 100 * COD_RATE, 0.908);
test("Single COD Point value", 1 * COD_RATE, 0.00908);

// ========== PACKAGE PRICING TESTS ==========
console.log("\n=== PACKAGE PRICING TESTS ===");

const packages = [
  { points: 200, price: 1.99, bonus: 0 },
  { points: 500, price: 4.99, bonus: 0 },
  { points: 1100, price: 9.99, bonus: 100 }, // 10% bonus
  { points: 2400, price: 19.99, bonus: 400 }, // 20% bonus
  { points: 5000, price: 39.99, bonus: 1000 }, // 25% bonus
  { points: 13000, price: 99.99, bonus: 3000 }, // 30% bonus
];

packages.forEach((pkg) => {
  const effectiveRate = pkg.price / pkg.points;
  console.log(
    `${pkg.points} CP for $${pkg.price} = $${effectiveRate.toFixed(5)}/point`
  );

  if (pkg.bonus > 0) {
    const basePoints = pkg.points - pkg.bonus;
    console.log(
      `  Base: ${basePoints}, Bonus: ${pkg.bonus} (${(
        (pkg.bonus / basePoints) *
        100
      ).toFixed(0)}%)`
    );
  }
});

// ========== BUNDLE COST TESTS ==========
console.log("\n=== COMMON BUNDLE PRICES ===");

const bundles = {
  battlePass: 1000,
  battlePassBundle: 2400,
  operatorSkin: 2400,
  weaponBlueprint: 1200,
  tracerPack: 1600,
  mastercraft: 2400,
  proPackBundle: 3000,
};

Object.entries(bundles).forEach(([item, cost]) => {
  const usdCost = cost * COD_RATE;
  console.log(`${item}: ${cost} CP = $${usdCost.toFixed(2)}`);

  // Find cheapest package
  const suitable = packages.filter((pkg) => pkg.points >= cost);
  if (suitable.length > 0) {
    const best = suitable[0];
    console.log(`  Buy: ${best.points} CP for $${best.price}`);
    const leftover = best.points - cost;
    if (leftover > 0) {
      console.log(
        `  Leftover: ${leftover} CP ($${(leftover * COD_RATE).toFixed(
          2
        )} value)`
      );
    }
  }
});

// ========== CURRENCY CONVERSION TESTS ==========
console.log("\n=== CURRENCY CONVERSION TESTS ===");

const mockRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52,
};

function convertFromUSD(usdAmount, targetCurrency) {
  return usdAmount * mockRates[targetCurrency];
}

// Test 1100 COD Points in different currencies
test("1100 CP in EUR", convertFromUSD(9.99, "EUR"), 9.19);
test("1100 CP in GBP", convertFromUSD(9.99, "GBP"), 7.89);
test("1100 CP in CAD", convertFromUSD(9.99, "CAD"), 13.49);
test("1100 CP in AUD", convertFromUSD(9.99, "AUD"), 15.18);

// ========== BONUS EFFICIENCY TESTS ==========
console.log("\n=== BONUS EFFICIENCY ANALYSIS ===");

packages.forEach((pkg, index) => {
  if (index === 0) return;

  const smallestRate = packages[0].price / packages[0].points;
  const pkgRate = pkg.price / pkg.points;
  const efficiency = ((smallestRate - pkgRate) / smallestRate) * 100;

  console.log(`${pkg.points} CP package:`);
  console.log(`  Efficiency vs base: ${efficiency.toFixed(1)}% better`);
  console.log(
    `  You save: $${(pkg.points * smallestRate - pkg.price).toFixed(2)}`
  );
});

// ========== BATTLE PASS VALUE TESTS ==========
console.log("\n=== BATTLE PASS ECONOMICS ===");

const battlePassCost = 1000;
const battlePassReturn = 1300;
const battlePassProfit = battlePassReturn - battlePassCost;

test("Battle Pass cost", battlePassCost * COD_RATE, 9.08);
test("Battle Pass return value", battlePassReturn * COD_RATE, 11.8);
test("Battle Pass profit", battlePassProfit * COD_RATE, 2.72);

console.log("\nBattle Pass Analysis:");
console.log(
  `  Investment: ${battlePassCost} CP ($${(battlePassCost * COD_RATE).toFixed(
    2
  )})`
);
console.log(
  `  Return: ${battlePassReturn} CP ($${(battlePassReturn * COD_RATE).toFixed(
    2
  )})`
);
console.log(
  `  Profit: ${battlePassProfit} CP ($${(battlePassProfit * COD_RATE).toFixed(
    2
  )})`
);
console.log(
  `  ROI: ${((battlePassProfit / battlePassCost) * 100).toFixed(1)}%`
);

// ========== LEFTOVER POINTS PSYCHOLOGY ==========
console.log("\n=== LEFTOVER POINTS ANALYSIS ===");

const commonPurchases = [1000, 800, 1200, 1600, 2400];
packages.forEach((pkg) => {
  console.log(`\nBuying ${pkg.points} CP package ($${pkg.price}):`);
  commonPurchases.forEach((purchase) => {
    if (purchase <= pkg.points) {
      const leftover = pkg.points - purchase;
      if (leftover > 0 && leftover < 800) {
        console.log(
          `  After ${purchase} CP item: ${leftover} CP left (can't buy anything)`
        );
      }
    }
  });
});

// ========== INPUT VALIDATION TESTS ==========
console.log("\n=== INPUT VALIDATION ===");

function validateInput(value) {
  if (value === null || value === undefined || value === "") return 0;

  // Check for negative numbers first
  if (String(value).includes("-")) {
    return 0; // Return 0 for negative numbers
  }

  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0 || num > 999999999) {
    return 0; // Return 0 for invalid input
  }
  return num;
}

test("Negative returns 0", validateInput(-1000), 0);
test("Text stripped", validateInput("abc2400xyz"), 2400);
test("Max limit", validateInput(9999999999), 0);
test("Decimals preserved", validateInput("1000.50"), 1000.5);
test("Currency symbols removed", validateInput("$1,100"), 1100);

// ========== SEASONAL SPENDING TESTS ==========
console.log("\n=== YEARLY SPENDING PROJECTIONS ===");

const seasonsPerYear = 6;
const avgBundlesPerSeason = 2;

const casualSpender = battlePassCost * seasonsPerYear;
const regularSpender = (battlePassCost + 2400) * seasonsPerYear;
const whaleSpender = 13000 * 4; // Quarterly big purchases

console.log(
  `Casual (BP only): ${casualSpender} CP/year = $${(
    casualSpender * COD_RATE
  ).toFixed(2)}`
);
console.log(
  `Regular (BP + 1 bundle): ${regularSpender} CP/year = $${(
    regularSpender * COD_RATE
  ).toFixed(2)}`
);
console.log(
  `Whale (Quarterly 13k): ${whaleSpender} CP/year = $${(
    whaleSpender * COD_RATE
  ).toFixed(2)}`
);

// ========== SUMMARY ==========
console.log("\n========== TEST RESULTS ==========");
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`Total Tests: ${testsPassed + testsFailed}`);
console.log(
  `Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(
    1
  )}%`
);

if (testsFailed === 0) {
  console.log("\n🎉 All tests passed! Calculator is working correctly.");
} else {
  console.log("\n⚠️ Some tests failed. Please review the calculations.");
}

// ========== BROWSER DOM TESTS ==========
console.log("\n=== BROWSER TESTS (Run in Console) ===");
console.log(`
// Test 1: Battle Pass cost
document.getElementById('cod-input').value = 1000;
document.getElementById('cod-input').dispatchEvent(new Event('input'));
console.log('Should be ~$9.08:', document.getElementById('usd-input').value);

// Test 2: Bundle cost
document.getElementById('cod-input').value = 2400;
document.getElementById('cod-input').dispatchEvent(new Event('input'));
console.log('Should be ~$21.79:', document.getElementById('usd-input').value);

// Test 3: Quick buttons
document.querySelectorAll('.quick-btn')[2].click(); // 2400 CP
console.log('Should show 2400:', document.getElementById('cod-input').value);

// Test 4: Currency switch
document.getElementById('currency-select').value = 'GBP';
document.getElementById('currency-select').dispatchEvent(new Event('change'));
console.log('Check GBP conversion');
`);
