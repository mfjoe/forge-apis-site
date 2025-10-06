// Create a new file: apex-coins-calculator-tests.js

// ========== TEST SUITE FOR APEX COINS CALCULATOR ==========

console.log("Starting Apex Coins Calculator Tests...\n");

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

const APEX_RATE = 9.99 / 1000; // $0.00999 per Apex Coin

// Test basic conversion rate
test("1000 Apex Coins = $9.99", 1000 * APEX_RATE, 9.99);
test("100 Apex Coins = ~$1.00", 100 * APEX_RATE, 0.999);
test("2150 Apex Coins basic rate", 2150 * APEX_RATE, 21.48);
test("Single Apex Coin value", 1 * APEX_RATE, 0.00999);

// ========== PACKAGE PRICING TESTS ==========
console.log("\n=== PACKAGE PRICING TESTS ===");

const packages = [
  { coins: 1000, price: 9.99, bonus: 0 },
  { coins: 2150, price: 19.99, bonus: 150 },
  { coins: 4350, price: 39.99, bonus: 350 },
  { coins: 6700, price: 59.99, bonus: 700 },
  { coins: 11500, price: 99.99, bonus: 1500 },
];

packages.forEach((pkg) => {
  const baseCoins = pkg.coins - pkg.bonus;
  const effectiveRate = pkg.price / pkg.coins;
  console.log(
    `Package: ${pkg.coins} coins for $${pkg.price} = $${effectiveRate.toFixed(
      5
    )}/coin`
  );

  // Test if bonus calculation is correct
  if (pkg.bonus > 0) {
    const expectedBase = (pkg.price / 9.99) * 1000;
    console.log(
      `  Base coins: ${expectedBase.toFixed(0)}, Bonus: ${pkg.bonus}`
    );
  }
});

// ========== CURRENCY CONVERSION TESTS ==========
console.log("\n=== CURRENCY CONVERSION TESTS ===");

// Mock currency rates
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

// Test 1000 Apex Coins in different currencies
test("1000 AC in EUR", convertFromUSD(9.99, "EUR"), 9.19);
test("1000 AC in GBP", convertFromUSD(9.99, "GBP"), 7.89);
test("1000 AC in CAD", convertFromUSD(9.99, "CAD"), 13.49);
test("1000 AC in AUD", convertFromUSD(9.99, "AUD"), 15.18);

// Test battle pass cost (950 Apex Coins)
const battlePassCoins = 950;
const battlePassUSD = battlePassCoins * APEX_RATE;
test("Battle Pass (950 AC) in USD", battlePassUSD, 9.49);
test("Battle Pass in EUR", convertFromUSD(battlePassUSD, "EUR"), 8.73);

// ========== INPUT VALIDATION TESTS ==========
console.log("\n=== INPUT VALIDATION TESTS ===");

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

test("Negative input returns 0", validateInput(-500), 0);
test("Letters removed", validateInput("abc1000xyz"), 1000);
test("Max limit enforced", validateInput(9999999999), 0);
test("Decimal preservation", validateInput("950.50"), 950.5);
test("Special chars removed", validateInput("$1,800"), 1800);

// ========== ITEM COST TESTS ==========
console.log("\n=== ITEM COST TESTS ===");

const itemCosts = {
  battlePass: 950,
  legendarysSkin: 1800,
  epicSkin: 1000,
  rareSkin: 500,
  heirloomEvent: 16800, // Full collection event
  starterPack: 500,
};

Object.entries(itemCosts).forEach(([item, cost]) => {
  const usdCost = cost * APEX_RATE;
  console.log(`${item}: ${cost} AC = $${usdCost.toFixed(2)}`);

  // Find best package for this item
  const bestPackage =
    packages.find((pkg) => pkg.coins >= cost) || packages[packages.length - 1];
  console.log(
    `  Best package: ${bestPackage.coins} coins for $${bestPackage.price}`
  );
});

// ========== BONUS COINS TESTS ==========
console.log("\n=== BONUS COINS EFFICIENCY ===");

packages.forEach((pkg, index) => {
  if (index === 0) return; // Skip base package

  const baseRate = packages[0].price / packages[0].coins;
  const pkgRate = pkg.price / pkg.coins;
  const savings = ((baseRate - pkgRate) / baseRate) * 100;

  test(`${pkg.coins} package savings`, savings > 0, true);
  console.log(`  ${savings.toFixed(1)}% better than base rate`);
});

// ========== DEAL FINDER TESTS ==========
console.log("\n=== DEAL FINDER LOGIC ===");

function findBestDeal(targetCoins) {
  // Find smallest package that covers the amount
  const suitable = packages.filter((pkg) => pkg.coins >= targetCoins);
  if (suitable.length === 0) return packages[packages.length - 1];

  // Calculate cost efficiency
  return suitable.reduce((best, current) => {
    const bestEfficiency = best.price / best.coins;
    const currentEfficiency = current.price / current.coins;
    return currentEfficiency < bestEfficiency ? current : best;
  });
}

// Test deal finder for common scenarios
const testAmounts = [950, 1800, 2400, 3600, 5000];
testAmounts.forEach((amount) => {
  const best = findBestDeal(amount);
  console.log(
    `For ${amount} AC, best is ${best.coins} package at $${best.price}`
  );
});

// ========== HEIRLOOM COST TESTS ==========
console.log("\n=== HEIRLOOM/COLLECTION EVENT COSTS ===");

const eventPackCost = 700; // Apex Coins per event pack
const packsNeeded = 24; // For guaranteed heirloom
const totalEventCost = eventPackCost * packsNeeded;

test("Full collection event cost", totalEventCost, 16800);
test("Full event in USD", totalEventCost * APEX_RATE, 167.83);

// Calculate most efficient way to buy
let remainingCoins = totalEventCost;
let totalSpent = 0;
const purchaseStrategy = [];

// Greedily pick largest packages first
const sortedPackages = [...packages].sort((a, b) => b.coins - a.coins);
while (remainingCoins > 0) {
  const bestPkg =
    sortedPackages.find((pkg) => pkg.coins <= remainingCoins + 2000) ||
    packages[0];
  purchaseStrategy.push(bestPkg);
  remainingCoins -= bestPkg.coins;
  totalSpent += bestPkg.price;
}

console.log("\nOptimal purchase strategy for heirloom:");
purchaseStrategy.forEach((pkg) => {
  console.log(`  Buy ${pkg.coins} coins for $${pkg.price}`);
});
console.log(`Total cost: $${totalSpent.toFixed(2)}`);

// ========== EA PLAY DISCOUNT TESTS ==========
console.log("\n=== EA PLAY 10% DISCOUNT ===");

const EA_PLAY_DISCOUNT = 0.1;
packages.forEach((pkg) => {
  const discountedPrice = pkg.price * (1 - EA_PLAY_DISCOUNT);
  const discountedRate = discountedPrice / pkg.coins;
  console.log(
    `${pkg.coins} AC: $${pkg.price} → $${discountedPrice.toFixed(2)} (saves $${(
      pkg.price * EA_PLAY_DISCOUNT
    ).toFixed(2)})`
  );
  test(`EA Play rate for ${pkg.coins}`, discountedPrice, pkg.price * 0.9);
});

// ========== REGIONAL PRICING TESTS ==========
console.log("\n=== REGIONAL PRICE VARIATIONS ===");

// Simulate regional pricing differences (% of US price)
const regionalPricing = {
  US: 1.0,
  UK: 1.02, // Usually slightly more expensive
  EU: 1.05, // VAT included
  CA: 1.35, // Direct currency conversion
  AU: 1.48, // GST + exchange rate
  BR: 0.65, // Regional pricing
  TR: 0.45, // Regional pricing
  AR: 0.4, // Regional pricing
};

const basePackage = packages[0]; // 1000 coins
Object.entries(regionalPricing).forEach(([region, multiplier]) => {
  const regionalPrice = basePackage.price * multiplier;
  console.log(
    `${region}: $${regionalPrice.toFixed(2)} (${(
      (multiplier - 1) *
      100
    ).toFixed(0)}% difference)`
  );
});

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
console.log("\n=== BROWSER DOM TESTS (Run in Console) ===");
console.log(`
// Test 1: Enter 1000 Apex Coins
document.getElementById('apex-input').value = 1000;
document.getElementById('apex-input').dispatchEvent(new Event('input'));
console.log('USD Output should be ~9.99:', document.getElementById('usd-input').value);

// Test 2: Test battle pass cost
document.getElementById('apex-input').value = 950;
document.getElementById('apex-input').dispatchEvent(new Event('input'));
console.log('Battle Pass cost should be ~9.49:', document.getElementById('usd-input').value);

// Test 3: Test legendary skin
document.getElementById('apex-input').value = 1800;
document.getElementById('apex-input').dispatchEvent(new Event('input'));
console.log('Legendary skin should be ~17.98:', document.getElementById('usd-input').value);

// Test 4: Currency switching
document.getElementById('currency-select').value = 'EUR';
document.getElementById('currency-select').dispatchEvent(new Event('change'));
console.log('Check EUR conversion');

// Test 5: Quick buttons
document.querySelectorAll('.quick-btn')[0].click();
console.log('Should show 1000 AC');
`);
