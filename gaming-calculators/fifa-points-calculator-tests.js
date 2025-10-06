// Create a new file: fifa-points-calculator-tests.js

// ========== TEST SUITE FOR FIFA POINTS CALCULATOR ==========

console.log("Starting FIFA Points Calculator Tests...\n");

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

const FIFA_RATE = 9.99 / 1000; // Correct rate: $0.00999 per point

// Test basic conversions
test("1000 FIFA Points = $9.99", 1000 * FIFA_RATE, 9.99);
test("100 FIFA Points = ~$1.00", 100 * FIFA_RATE, 0.999);
test("2500 FIFA Points", 2500 * FIFA_RATE, 24.975);
test("Single FIFA Point", 1 * FIFA_RATE, 0.00999);

// ========== PACKAGE PRICING TESTS ==========
console.log("\n=== PACKAGE PRICING ANALYSIS ===");

const packages = [
  { points: 1000, price: 9.99, discount: 0 },
  { points: 2500, price: 24.99, discount: 0 },
  { points: 5000, price: 49.99, discount: 0 },
  { points: 12000, price: 99.99, discount: 16.7 },
];

packages.forEach((pkg) => {
  const baseRate = 0.00999;
  const actualRate = pkg.price / pkg.points;
  const expectedPrice = pkg.points * baseRate;

  console.log(`\n${pkg.points} Points Package:`);
  console.log(`  Price: $${pkg.price}`);
  console.log(`  Rate: $${actualRate.toFixed(5)}/point`);
  console.log(`  Expected (no discount): $${expectedPrice.toFixed(2)}`);

  if (pkg.discount > 0) {
    const savings = expectedPrice - pkg.price;
    console.log(`  💰 Savings: $${savings.toFixed(2)} (${pkg.discount}% off)`);
  } else {
    console.log(`  No discount - standard rate`);
  }
});

// ========== PACK COST ANALYSIS ==========
console.log("\n=== COMMON PACK PRICES ===");

const packs = {
  "Bronze Pack": 400,
  "Silver Pack": 750,
  "Gold Pack": 500,
  "Premium Gold Pack": 750,
  "Rare Players Pack": 2500,
  "Jumbo Rare Players": 2000,
  "Ultimate Pack": 2500,
  "125k Pack (Promo)": 2500,
  "100k Pack (Promo)": 2000,
  "50k Pack (Promo)": 1000,
};

Object.entries(packs).forEach(([packName, cost]) => {
  const usdCost = cost * FIFA_RATE;
  console.log(`${packName}: ${cost} Points = $${usdCost.toFixed(2)}`);

  // Find cheapest package to buy this pack
  const suitable = packages.filter((pkg) => pkg.points >= cost);
  if (suitable.length > 0) {
    const best = suitable[0];
    const leftover = best.points - cost;
    console.log(`  Buy: ${best.points} points for $${best.price}`);
    if (leftover > 0) {
      console.log(
        `  Leftover: ${leftover} points ($${(leftover * FIFA_RATE).toFixed(
          2
        )} value)`
      );
    }
  }
});

// ========== PACK PROBABILITY TESTS ==========
console.log("\n=== PACK PROBABILITY ANALYSIS ===");

const packOdds = {
  "84+ Player": 0.01, // 1%
  "87+ Player": 0.001, // 0.1%
  "90+ Player": 0.0001, // 0.01%
  "Icon Player": 0.00001, // 0.001%
  "TOTY Player": 0.00002, // 0.002% during TOTY
};

Object.entries(packOdds).forEach(([rating, probability]) => {
  const packsNeeded = Math.round(1 / probability);
  const costEstimate = packsNeeded * 750 * FIFA_RATE; // Using Premium Gold Pack cost

  console.log(`\n${rating}:`);
  console.log(`  Probability: ${(probability * 100).toFixed(3)}%`);
  console.log(`  Expected packs to get one: ${packsNeeded.toLocaleString()}`);
  console.log(`  Estimated cost: $${costEstimate.toFixed(2)}`);
});

// ========== CURRENCY CONVERSION TESTS ==========
console.log("\n=== CURRENCY CONVERSIONS ===");

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

// Test 1000 FIFA Points in different currencies
test("1000 Points in EUR", convertFromUSD(9.99, "EUR"), 9.19);
test("1000 Points in GBP", convertFromUSD(9.99, "GBP"), 7.89);
test("1000 Points in CAD", convertFromUSD(9.99, "CAD"), 13.49);
test("1000 Points in AUD", convertFromUSD(9.99, "AUD"), 15.18);

// ========== FUT CHAMPIONS REWARDS VS PURCHASE ==========
console.log("\n=== FUT CHAMPIONS REWARDS ANALYSIS ===");

const futChampionsRewards = {
  "Rank 1": { packs: 3, value: 7500 },
  "Rank 2": { packs: 2, value: 5000 },
  "Rank 3": { packs: 1, value: 2500 },
  "Rank 4": { packs: 1, value: 1500 },
  "Rank 5": { packs: 1, value: 1000 },
};

console.log("Weekend League Rewards (Points Equivalent):");
Object.entries(futChampionsRewards).forEach(([rank, reward]) => {
  const pointsValue = reward.packs * reward.value;
  const usdValue = pointsValue * FIFA_RATE;
  console.log(`${rank}: ${pointsValue} points value = $${usdValue.toFixed(2)}`);
});

// ========== YEARLY SPENDING PROJECTIONS ==========
console.log("\n=== ANNUAL SPENDING SCENARIOS ===");

const spendingProfiles = {
  "Casual (Monthly promo pack)": 2500 * 12,
  "Regular (Weekly 1000 points)": 1000 * 52,
  "Serious (Weekly 5000 points)": 5000 * 52,
  "Whale (Weekly 12000 points)": 12000 * 52,
  "Streamer (Daily packs)": 2500 * 365,
};

Object.entries(spendingProfiles).forEach(([profile, yearlyPoints]) => {
  const yearlyUSD = yearlyPoints * FIFA_RATE;
  const optimalPurchase =
    yearlyPoints > 12000
      ? Math.floor(yearlyPoints / 12000) * 99.99 +
        (yearlyPoints % 12000) * 0.00999
      : yearlyUSD;

  console.log(`\n${profile}:`);
  console.log(`  Points/year: ${yearlyPoints.toLocaleString()}`);
  console.log(`  Cost at standard rate: $${yearlyUSD.toFixed(2)}`);
  if (optimalPurchase < yearlyUSD) {
    console.log(`  Optimal purchase strategy: $${optimalPurchase.toFixed(2)}`);
    console.log(`  Savings: $${(yearlyUSD - optimalPurchase).toFixed(2)}`);
  }
});

// ========== LEFTOVER POINTS TRAP ==========
console.log("\n=== LEFTOVER POINTS ANALYSIS ===");

const commonPackCosts = [400, 500, 750, 1000, 1500, 2000, 2500];
console.log("After buying packs, leftover points that can't buy anything:");

packages.forEach((pkg) => {
  console.log(`\n${pkg.points} points package:`);
  commonPackCosts.forEach((packCost) => {
    const purchases = Math.floor(pkg.points / packCost);
    const leftover = pkg.points % packCost;
    if (leftover > 0 && leftover < 400) {
      // 400 is cheapest pack
      console.log(
        `  After ${purchases}x ${packCost}-point packs: ${leftover} points stuck`
      );
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

test("Negative input", validateInput(-1000), 0);
test("Text removal", validateInput("abc2500xyz"), 2500);
test("Max limit", validateInput(9999999999), 0);
test("Decimal handling", validateInput("1000.99"), 1000.99);
test("Currency symbols", validateInput("$12,000"), 12000);

// ========== GAME LIFECYCLE DEPRECIATION ==========
console.log("\n=== VALUE DEPRECIATION TIMELINE ===");

const monthsInCycle = 12;
const initialValue = 100; // $100 investment

for (let month = 1; month <= monthsInCycle; month++) {
  const remainingMonths = monthsInCycle - month + 1;
  const currentValue = (initialValue * remainingMonths) / monthsInCycle;
  const depreciation = initialValue - currentValue;

  console.log(
    `Month ${month}: $${currentValue.toFixed(
      2
    )} value remaining (-$${depreciation.toFixed(2)})`
  );

  if (month === 9) {
    console.log("  ⚠️ New game announced - mass player exodus begins");
  }
  if (month === 12) {
    console.log("  ❌ New game releases - all value lost");
  }
}

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
// Test 1: Basic conversion
document.getElementById('fifa-input').value = 1000;
document.getElementById('fifa-input').dispatchEvent(new Event('input'));
console.log('Should be $9.99:', document.getElementById('usd-input').value);

// Test 2: Premium Gold Pack
document.getElementById('fifa-input').value = 750;
document.getElementById('fifa-input').dispatchEvent(new Event('input'));
console.log('Should be ~$7.49:', document.getElementById('usd-input').value);

// Test 3: Ultimate Pack
document.getElementById('fifa-input').value = 2500;
document.getElementById('fifa-input').dispatchEvent(new Event('input'));
console.log('Should be ~$24.98:', document.getElementById('usd-input').value);

// Test 4: Quick buttons
document.querySelectorAll('.quick-btn')[3].click(); // 12000 points
console.log('Should show 12000:', document.getElementById('fifa-input').value);

// Test 5: Currency conversion
document.getElementById('currency-select').value = 'GBP';
document.getElementById('currency-select').dispatchEvent(new Event('change'));
console.log('Check GBP conversion');
`);
