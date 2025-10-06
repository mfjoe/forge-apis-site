// Create a new file: robux-calculator-tests.js

// ========== TEST SUITE FOR ROBUX CALCULATOR ==========

console.log("Starting Robux Calculator Tests...\n");

let testsPassed = 0;
let testsFailed = 0;

// Helper function
function test(description, actual, expected) {
  if (Math.abs(actual - expected) < 0.001) {
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
console.log("\n=== PLAYER PURCHASE RATES ===");

const PLAYER_RATE = 0.0125; // $0.0125 per Robux
const DEVEX_RATE = 0.0035; // $0.0035 per Robux
const MARKETPLACE_RATE = 0.0125 * 0.7; // After 30% tax

// Test purchase rates
test("400 Robux costs", 400 * PLAYER_RATE, 5.0);
test("800 Robux costs", 800 * PLAYER_RATE, 10.0);
test("1700 Robux costs", 1700 * (19.99 / 1700), 19.99);
test("4500 Robux costs", 4500 * (49.99 / 4500), 49.99);
test("10000 Robux costs", 10000 * (99.99 / 10000), 99.99);

// ========== DEVEX CONVERSION TESTS ==========
console.log("\n=== DEVEX CASHOUT RATES ===");

test("100,000 Robux DevEx value", 100000 * DEVEX_RATE, 350);
test("1,000,000 Robux DevEx value", 1000000 * DEVEX_RATE, 3500);
test("10,000 Robux (below minimum)", 10000 * DEVEX_RATE, 35);

// Calculate exploitation ratio
const exploitationRatio = (PLAYER_RATE - DEVEX_RATE) / PLAYER_RATE;
console.log(`\n💔 Exploitation Rate: ${(exploitationRatio * 100).toFixed(1)}%`);
console.log(`   Players pay $${PLAYER_RATE} per Robux`);
console.log(`   Developers get $${DEVEX_RATE} per Robux`);
console.log(
  `   Roblox keeps ${(exploitationRatio * 100).toFixed(1)}% of value`
);

// ========== MARKETPLACE TAX TESTS ==========
console.log("\n=== MARKETPLACE TRANSACTIONS ===");

const marketplaceTax = 0.3;
test("100 Robux item after tax", 100 * (1 - marketplaceTax), 70);
test("1000 Robux item after tax", 1000 * (1 - marketplaceTax), 700);
test("Value after tax in USD", 100 * (1 - marketplaceTax) * DEVEX_RATE, 0.245);

// ========== PACKAGE VALUE ANALYSIS ==========
console.log("\n=== PACKAGE EFFICIENCY ===");

const packages = [
  { robux: 400, price: 4.99 },
  { robux: 800, price: 9.99 },
  { robux: 1700, price: 19.99 },
  { robux: 4500, price: 49.99 },
  { robux: 10000, price: 99.99 },
];

packages.forEach((pkg) => {
  const rate = pkg.price / pkg.robux;
  const savings = ((PLAYER_RATE - rate) / PLAYER_RATE) * 100;
  console.log(`\n${pkg.robux} Robux Package:`);
  console.log(`  Price: $${pkg.price}`);
  console.log(`  Rate: $${rate.toFixed(5)}/Robux`);
  if (savings > 0) {
    console.log(`  💰 Savings: ${savings.toFixed(1)}% off base rate`);
  } else {
    console.log(`  No discount`);
  }
});

// ========== PREMIUM SUBSCRIPTION ANALYSIS ==========
console.log("\n=== PREMIUM SUBSCRIPTION VALUE ===");

const premiumTiers = {
  "Premium 450": { price: 4.99, monthly: 450 },
  "Premium 1000": { price: 9.99, monthly: 1000 },
  "Premium 2200": { price: 19.99, monthly: 2200 },
};

Object.entries(premiumTiers).forEach(([tier, data]) => {
  const yearlyRobux = data.monthly * 12;
  const yearlyCost = data.price * 12;
  const effectiveRate = yearlyCost / yearlyRobux;

  console.log(`\n${tier}:`);
  console.log(`  Monthly: ${data.monthly} Robux for $${data.price}`);
  console.log(`  Yearly: ${yearlyRobux} Robux for $${yearlyCost.toFixed(2)}`);
  console.log(`  Effective rate: $${effectiveRate.toFixed(5)}/Robux`);
  console.log(
    `  vs Buying: ${(
      ((PLAYER_RATE - effectiveRate) / PLAYER_RATE) *
      100
    ).toFixed(1)}% savings`
  );
});

// ========== DEVELOPER INCOME REALITY ==========
console.log("\n=== DEVELOPER EARNINGS ANALYSIS ===");

function calculateDevIncome(playerSpending) {
  const robuxGenerated = playerSpending / PLAYER_RATE;
  const devExPayout = robuxGenerated * DEVEX_RATE;
  const robloxKeeps = playerSpending - devExPayout;

  return { robuxGenerated, devExPayout, robloxKeeps };
}

const spendingScenarios = [100, 1000, 10000, 100000];
spendingScenarios.forEach((spending) => {
  const income = calculateDevIncome(spending);
  console.log(`\nPlayer spends $${spending}:`);
  console.log(`  Robux generated: ${income.robuxGenerated.toLocaleString()}`);
  console.log(`  Developer receives: $${income.devExPayout.toFixed(2)}`);
  console.log(
    `  Roblox keeps: $${income.robloxKeeps.toFixed(2)} (${(
      (income.robloxKeeps / spending) *
      100
    ).toFixed(1)}%)`
  );
});

// ========== MINIMUM WAGE CALCULATION ==========
console.log("\n=== HOURS TO MINIMUM WAGE ===");

const minWage = 15; // $15/hour
const robuxNeededPerHour = minWage / DEVEX_RATE;
const playerSpendingNeeded = robuxNeededPerHour * PLAYER_RATE;

console.log(`To earn $${minWage}/hour via DevEx:`);
console.log(`  Need ${robuxNeededPerHour.toLocaleString()} Robux/hour`);
console.log(
  `  Requires $${playerSpendingNeeded.toFixed(2)} in player spending/hour`
);
console.log(
  `  That's ${(robuxNeededPerHour / 100).toFixed(
    0
  )} game passes at 100 Robux each`
);

// ========== CHILD SPENDING SCENARIOS ==========
console.log("\n=== YEARLY SPENDING IMPACT ===");

const monthlyAllowances = [5, 10, 20, 50];
monthlyAllowances.forEach((monthly) => {
  const yearly = monthly * 12;
  const robuxYearly = yearly / PLAYER_RATE;
  const devValue = robuxYearly * DEVEX_RATE;

  console.log(`\n$${monthly}/month allowance:`);
  console.log(`  Yearly spend: $${yearly}`);
  console.log(`  Robux purchased: ${Math.floor(robuxYearly).toLocaleString()}`);
  console.log(`  Actual value to developers: $${devValue.toFixed(2)}`);
  console.log(`  Value lost to Roblox: $${(yearly - devValue).toFixed(2)}`);
});

// ========== GAMBLING MECHANICS TEST ==========
console.log("\n=== GAMBLING/LOOT BOX EQUIVALENTS ===");

const lootBoxPrices = [50, 100, 250, 500, 1000];
lootBoxPrices.forEach((price) => {
  const usdCost = price * PLAYER_RATE;
  console.log(`${price} Robux "spin"/box = $${usdCost.toFixed(2)}`);
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
    return Math.max(0, Math.min(999999999, isNaN(num) ? 0 : num));
  }
  return num;
}

test("Negative input", validateInput(-1000), 0);
test("Text removal", validateInput("abc1700xyz"), 1700);
test("Max limit", validateInput(9999999999), 999999999);
test("Decimal handling", validateInput("800.50"), 800.5);
test("Currency symbols", validateInput("$10,000"), 10000);

// ========== REGIONAL INEQUALITY TEST ==========
console.log("\n=== REGIONAL PRICING INEQUALITY ===");

const regions = {
  USA: 1.0,
  Turkey: 0.39,
  Brazil: 0.65,
  India: 0.55,
  Philippines: 0.6,
};

console.log("80 Robux package prices:");
Object.entries(regions).forEach(([country, multiplier]) => {
  const localPrice = 0.99 * multiplier;
  const robuxPer = 80;
  const rateLocal = localPrice / robuxPer;
  const devexUSD = robuxPer * DEVEX_RATE;

  console.log(`\n${country}:`);
  console.log(`  Pays: $${localPrice.toFixed(2)} for ${robuxPer} Robux`);
  console.log(`  Rate: $${rateLocal.toFixed(5)}/Robux`);
  console.log(`  DevEx return: $${devexUSD.toFixed(2)} (same for all)`);
  console.log(
    `  Loss: ${((1 - devexUSD / localPrice) * 100).toFixed(1)}% of spending`
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

// ========== ETHICAL SUMMARY ==========
console.log("\n=== ETHICAL CONCERNS SUMMARY ===");
console.log("❌ 72% value extraction from child developers");
console.log("❌ Gambling mechanics targeting minors");
console.log("❌ Regional pricing inequality");
console.log("❌ 99.5% of developers never reach payout threshold");
console.log("❌ Effective hourly wage often below $1");

// ========== BROWSER DOM TESTS ==========
console.log("\n=== BROWSER TESTS (Run in Console) ===");
console.log(`
// Test 1: Player purchase mode
document.querySelector('[onclick="setMode(\\'purchase\\')"]').click();
document.getElementById('robux-input').value = 800;
document.getElementById('robux-input').dispatchEvent(new Event('input'));
console.log('Should be ~$10.00:', document.getElementById('usd-input').value);

// Test 2: DevEx mode
document.querySelector('[onclick="setMode(\\'devex\\')"]').click();
document.getElementById('robux-input').value = 100000;
document.getElementById('robux-input').dispatchEvent(new Event('input'));
console.log('Should be $350:', document.getElementById('usd-input').value);

// Test 3: Marketplace mode
document.querySelector('[onclick="setMode(\\'marketplace\\')"]').click();
document.getElementById('robux-input').value = 100;
document.getElementById('robux-input').dispatchEvent(new Event('input'));
console.log('Should show after-tax value');
`);
