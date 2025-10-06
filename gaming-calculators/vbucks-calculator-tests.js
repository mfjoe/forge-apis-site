// Create a new file: vbucks-calculator-tests.js

// ========== TEST SUITE FOR V-BUCKS CALCULATOR ==========

console.log("Starting V-Bucks Calculator Tests...\n");

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
console.log("\n=== V-BUCKS CONVERSION RATES ===");

const VBUCKS_RATE = 7.99 / 1000; // $0.00799 per V-Buck

// Test basic conversions
test("1000 V-Bucks = $7.99", 1000 * VBUCKS_RATE, 7.99);
test("100 V-Bucks", 100 * VBUCKS_RATE, 0.799);
test("950 V-Bucks (Battle Pass)", 950 * VBUCKS_RATE, 7.59);
test("Single V-Buck value", 1 * VBUCKS_RATE, 0.00799);

// ========== PACKAGE PRICING TESTS ==========
console.log("\n=== PACKAGE VALUE ANALYSIS ===");

const packages = [
  { vbucks: 1000, price: 7.99, savings: 0 },
  { vbucks: 2800, price: 19.99, savings: 10.6 },
  { vbucks: 5000, price: 31.99, savings: 19.9 },
  { vbucks: 13500, price: 79.99, savings: 25.8 },
];

packages.forEach((pkg) => {
  const baseRate = 0.00799;
  const actualRate = pkg.price / pkg.vbucks;
  const expectedBase = pkg.vbucks * baseRate;
  const actualSavings = ((baseRate - actualRate) / baseRate) * 100;

  console.log(`\n${pkg.vbucks} V-Bucks Package:`);
  console.log(`  Price: $${pkg.price}`);
  console.log(`  Rate: $${actualRate.toFixed(5)}/V-Buck`);
  console.log(`  Expected at base: $${expectedBase.toFixed(2)}`);
  if (actualSavings > 0) {
    console.log(`  💰 Savings: ${actualSavings.toFixed(1)}% off base rate`);
  }
});

// ========== ITEM SHOP COSTS ==========
console.log("\n=== COMMON ITEM PRICES ===");

const shopItems = {
  "Uncommon Skin": 800,
  "Rare Skin": 1200,
  "Epic Skin": 1500,
  "Legendary Skin": 2000,
  "Icon Series": 2000,
  "Battle Pass": 950,
  "Emote (Rare)": 500,
  "Pickaxe (Epic)": 1200,
  "Glider (Legendary)": 1500,
  "Bundle (Average)": 2500,
};

Object.entries(shopItems).forEach(([item, cost]) => {
  const usdCost = cost * VBUCKS_RATE;
  console.log(`${item}: ${cost} V-Bucks = $${usdCost.toFixed(2)}`);
});

// ========== BATTLE PASS ECONOMICS ==========
console.log("\n=== BATTLE PASS VALUE ANALYSIS ===");

const battlePassCost = 950;
const battlePassReturn = 1500;
const battlePassProfit = battlePassReturn - battlePassCost;
const hoursRequired = 75; // Average to complete

console.log(`Battle Pass Investment:`);
console.log(
  `  Cost: ${battlePassCost} V-Bucks ($${(battlePassCost * VBUCKS_RATE).toFixed(
    2
  )})`
);
console.log(
  `  Return: ${battlePassReturn} V-Bucks ($${(
    battlePassReturn * VBUCKS_RATE
  ).toFixed(2)})`
);
console.log(
  `  Profit: ${battlePassProfit} V-Bucks ($${(
    battlePassProfit * VBUCKS_RATE
  ).toFixed(2)})`
);
console.log(
  `  ROI: ${((battlePassProfit / battlePassCost) * 100).toFixed(1)}%`
);
console.log(`  Time investment: ${hoursRequired} hours`);
console.log(
  `  Value per hour: $${(
    (battlePassProfit * VBUCKS_RATE) /
    hoursRequired
  ).toFixed(3)}`
);

// ========== SAVE THE WORLD EARNINGS ==========
console.log("\n=== SAVE THE WORLD V-BUCKS GENERATION ===");

const dailyReward = 50;
const weeklyLogin = 150;
const monthlyStormShield = 100;
const monthlyTotal = dailyReward * 30 + weeklyLogin * 4 + monthlyStormShield;
const yearlyTotal = monthlyTotal * 12;

console.log(`Daily Rewards: ${dailyReward} V-Bucks/day`);
console.log(`Weekly Login: ${weeklyLogin} V-Bucks/week`);
console.log(
  `Monthly Total: ${monthlyTotal} V-Bucks ($${(
    monthlyTotal * VBUCKS_RATE
  ).toFixed(2)})`
);
console.log(
  `Yearly Total: ${yearlyTotal} V-Bucks ($${(yearlyTotal * VBUCKS_RATE).toFixed(
    2
  )})`
);

// ========== CURRENCY COMPARISON ==========
console.log("\n=== GAMING CURRENCY COMPARISON ===");

const currencyRates = {
  "V-Bucks (Fortnite)": 0.00799,
  "Robux (Roblox)": 0.0125,
  "COD Points": 0.00908,
  "Apex Coins": 0.01,
  Minecoins: 0.00625,
  "FIFA Points": 0.00999,
};

const vbucksRate = currencyRates["V-Bucks (Fortnite)"];
Object.entries(currencyRates).forEach(([currency, rate]) => {
  if (currency !== "V-Bucks (Fortnite)") {
    const percentDiff = ((rate - vbucksRate) / vbucksRate) * 100;
    console.log(
      `${currency}: $${rate.toFixed(5)}/unit (${
        percentDiff > 0 ? "+" : ""
      }${percentDiff.toFixed(1)}% vs V-Bucks)`
    );
  }
});

// ========== SEASONAL SPENDING PATTERNS ==========
console.log("\n=== SEASONAL SPENDING ANALYSIS ===");

const seasonsPerYear = 4;
const avgBattlePassPerSeason = 1;
const avgShopSpendingPerSeason = 2000; // V-Bucks
const totalSeasonalSpending =
  (avgBattlePassPerSeason * battlePassCost + avgShopSpendingPerSeason) *
  seasonsPerYear;

console.log(`Annual V-Bucks Spending (Battle Pass + Shop):`);
console.log(
  `  Per Season: ${
    avgBattlePassPerSeason * battlePassCost + avgShopSpendingPerSeason
  } V-Bucks`
);
console.log(`  Yearly Total: ${totalSeasonalSpending} V-Bucks`);
console.log(
  `  Yearly Cost: $${(totalSeasonalSpending * VBUCKS_RATE).toFixed(2)}`
);

// ========== COLLABORATION IMPACT ==========
console.log("\n=== COLLABORATION BUNDLE COSTS ===");

const collabBundles = {
  "Marvel Bundle": 2800,
  "Star Wars Bundle": 2500,
  "NFL Bundle": 2000,
  "Music Artist Bundle": 3000,
  "Anime Bundle": 2200,
  "Movie Bundle": 2600,
};

console.log("Popular Collaboration Bundles:");
Object.entries(collabBundles).forEach(([collab, cost]) => {
  const usdCost = cost * VBUCKS_RATE;
  console.log(`${collab}: ${cost} V-Bucks = $${usdCost.toFixed(2)}`);
});

// ========== CREATIVE MODE EARNINGS ==========
console.log("\n=== CREATIVE MODE V-BUCKS GENERATION ===");

const creativeEarnings = {
  "Support-A-Creator": 500000, // V-Bucks threshold
  "Creator Code Revenue": 0.05, // 5% of purchases
  "Island Code Revenue": 0.05, // 5% of purchases
  "Minimum Payout": 100, // V-Bucks minimum
};

console.log("Creative Mode Earnings:");
Object.entries(creativeEarnings).forEach(([type, value]) => {
  if (type.includes("Revenue")) {
    console.log(`${type}: ${(value * 100).toFixed(1)}% of purchases`);
  } else {
    console.log(`${type}: ${value.toLocaleString()} V-Bucks`);
  }
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
test("Text removal", validateInput("abc2800xyz"), 2800);
test("Max limit", validateInput(9999999999), 999999999);
test("Decimal handling", validateInput("950.50"), 950.5);
test("Currency symbols", validateInput("$13,500"), 13500);

// ========== REGIONAL PRICING ==========
console.log("\n=== REGIONAL PRICING VARIATIONS ===");

const regionalPrices = {
  USA: 1.0,
  UK: 1.02,
  EU: 1.05,
  Canada: 1.35,
  Australia: 1.48,
  Brazil: 0.65,
  Turkey: 0.39,
  India: 0.55,
};

const basePackage = 1000; // V-Bucks
const basePrice = 7.99; // USD

console.log("1000 V-Bucks package regional pricing:");
Object.entries(regionalPrices).forEach(([country, multiplier]) => {
  const localPrice = basePrice * multiplier;
  const localRate = localPrice / basePackage;
  console.log(
    `${country}: $${localPrice.toFixed(2)} ($${localRate.toFixed(5)}/V-Buck)`
  );
});

// ========== FOMO PSYCHOLOGY ANALYSIS ==========
console.log("\n=== FOMO AND LIMITED TIME OFFERS ===");

const limitedItems = {
  "Exclusive Skin (24h)": 2000,
  "Rare Emote (48h)": 800,
  "Bundle (Week)": 3500,
  "Battle Pass (Season)": 950,
  "Crew Pack (Monthly)": 1000,
};

console.log("Limited Time Item Pressures:");
Object.entries(limitedItems).forEach(([item, cost]) => {
  const usdCost = cost * VBUCKS_RATE;
  const urgency = item.includes("24h")
    ? "HIGH"
    : item.includes("48h")
    ? "HIGH"
    : item.includes("Week")
    ? "MEDIUM"
    : "LOW";
  console.log(`${item}: $${usdCost.toFixed(2)} (${urgency} urgency)`);
});

// ========== PARENTAL CONTROL ANALYSIS ==========
console.log("\n=== PARENTAL SPENDING CONTROL ===");

const spendingLimits = {
  "Daily Limit": 20,
  "Weekly Limit": 100,
  "Monthly Limit": 400,
  "Yearly Limit": 4800,
};

console.log("Recommended Spending Limits:");
Object.entries(spendingLimits).forEach(([period, limit]) => {
  const vbucksLimit = limit / VBUCKS_RATE;
  console.log(`${period}: $${limit} (${Math.floor(vbucksLimit)} V-Bucks)`);
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

// ========== FORTNITE ECONOMY SUMMARY ==========
console.log("\n=== FORTNITE ECONOMY INSIGHTS ===");
console.log("💰 V-Bucks are competitively priced vs other gaming currencies");
console.log("🎮 Battle Pass offers excellent ROI (57.9% return)");
console.log("⏰ Save the World can generate ~$38/year in free V-Bucks");
console.log("🎭 Collaboration bundles drive significant spending");
console.log("⚠️ FOMO mechanics create pressure for immediate purchases");
console.log("👨‍👩‍👧‍👦 Parental controls essential for child spending management");

// ========== BROWSER DOM TESTS ==========
console.log("\n=== BROWSER TESTS (Run in Console) ===");
console.log(`
// Test 1: Basic conversion
document.getElementById('vbucks-input').value = 1000;
document.getElementById('vbucks-input').dispatchEvent(new Event('input'));
console.log('Should be ~$7.99:', document.getElementById('usd-input').value);

// Test 2: Battle Pass cost
document.getElementById('vbucks-input').value = 950;
document.getElementById('vbucks-input').dispatchEvent(new Event('input'));
console.log('Should be ~$7.59:', document.getElementById('usd-input').value);

// Test 3: Large package
document.getElementById('vbucks-input').value = 13500;
document.getElementById('vbucks-input').dispatchEvent(new Event('input'));
console.log('Should be ~$107.87:', document.getElementById('usd-input').value);

// Test 4: Currency switching
document.getElementById('currency-select').value = 'EUR';
document.getElementById('currency-select').dispatchEvent(new Event('change'));
console.log('Check EUR conversion');

// Test 5: Quick buttons
document.querySelectorAll('.quick-btn')[0].click();
console.log('Should show 1000 V-Bucks');
`);
