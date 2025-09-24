/**
 * Gaming Calculator Usage Examples
 * Demonstrates how to use the CurrencyCalculator class
 * for different gaming currencies
 */

// Example 1: Robux Calculator
const robuxCalculator = new CurrencyCalculator({
  rate: 0.0125, // $0.0125 per Robux (Player Purchase Rate)
  currency: "Robux",
  symbol: "R$",
  quickAmounts: [400, 800, 1700, 4500, 10000],
  storageKey: "robuxCalculation",
  maxValue: 1000000,
  decimalPlaces: 2,
});

// Example 2: V-Bucks Calculator
const vbucksCalculator = new CurrencyCalculator({
  rate: 0.00799, // $0.00799 per V-Buck
  currency: "VBucks",
  symbol: "V",
  quickAmounts: [1000, 2800, 5000, 13500],
  storageKey: "vbucksCalculation",
  maxValue: 100000,
  decimalPlaces: 2,
});

// Example 3: Minecoins Calculator
const minecoinsCalculator = new CurrencyCalculator({
  rate: 0.005, // $0.005 per Minecoin
  currency: "Minecoins",
  symbol: "MC",
  quickAmounts: [320, 840, 1720, 3500, 8000],
  storageKey: "minecoinsCalculation",
  maxValue: 50000,
  decimalPlaces: 3,
});

// Example 4: Multi-rate Calculator (like Robux with DevEx)
class MultiRateCalculator extends CurrencyCalculator {
  constructor(options) {
    super(options);
    this.rates = options.rates || { standard: 0.01 };
    this.currentRateMode = options.defaultMode || "standard";
  }

  switchMode(mode) {
    if (this.rates[mode]) {
      this.currentRateMode = mode;
      this.config.rate = this.rates[mode];

      // Recalculate if there are values
      if (this.elements.currencyInput.value) {
        const currencyValue =
          parseFloat(this.elements.currencyInput.value.replace(/,/g, "")) || 0;
        const usdValue = this.convertToUsd(currencyValue);
        this.elements.usdInput.value =
          usdValue > 0 ? this.formatCurrency(usdValue) : "";
      }

      this.updateRateDisplay();
      this.trackEvent("rate_mode_changed", {
        mode,
        currency: this.config.currency,
      });
    }
  }

  updateRateDisplay() {
    if (this.elements.rateInfo) {
      const rateTexts = {
        standard: `Standard Rate: $${this.rates.standard} per ${this.config.currency}`,
        devex: `DevEx Rate: $${this.rates.devex} per ${this.config.currency}`,
        marketplace: `After Tax: $${this.rates.marketplace} per ${this.config.currency}`,
      };

      this.elements.rateInfo.innerHTML =
        rateTexts[this.currentRateMode] ||
        `Current Rate: $${this.config.rate} per ${this.config.currency}`;
    }
  }
}

// Example 5: Advanced Robux Calculator with multiple modes
const advancedRobuxCalculator = new MultiRateCalculator({
  rates: {
    purchase: 0.0125, // Player purchase rate
    devex: 0.0035, // Developer Exchange rate
    marketplace: 0.00875, // After 30% marketplace tax
  },
  defaultMode: "purchase",
  currency: "Robux",
  symbol: "R$",
  quickAmounts: [400, 800, 1700, 4500, 10000],
  storageKey: "advancedRobuxCalculation",
});

// Example 6: Custom Calculator with Battle Pass logic
class BattlePassCalculator extends CurrencyCalculator {
  constructor(options) {
    super(options);
    this.battlePassCost = options.battlePassCost || 950;
    this.battlePassReturn = options.battlePassReturn || 1500;
  }

  calculateBattlePassValue() {
    const netGain = this.battlePassReturn - this.battlePassCost;
    const usdCost = this.convertToUsd(this.battlePassCost);
    const usdReturn = this.convertToUsd(this.battlePassReturn);
    const usdNetGain = this.convertToUsd(netGain);

    return {
      cost: this.battlePassCost,
      return: this.battlePassReturn,
      netGain,
      usdCost: this.formatCurrency(usdCost),
      usdReturn: this.formatCurrency(usdReturn),
      usdNetGain: this.formatCurrency(usdNetGain),
      isProfit: netGain > 0,
    };
  }

  showBattlePassAnalysis() {
    const analysis = this.calculateBattlePassValue();

    this.showNotification(
      `Battle Pass Analysis: Cost ${analysis.cost} ${this.config.currency} ($${analysis.usdCost}), ` +
        `Return ${analysis.return} ${this.config.currency} ($${analysis.usdReturn}), ` +
        `Net: ${analysis.isProfit ? "+" : ""}${analysis.netGain} ${
          this.config.currency
        } ($${analysis.usdNetGain})`,
      analysis.isProfit ? "success" : "warning"
    );

    this.trackEvent("battle_pass_analysis", {
      currency: this.config.currency,
      net_gain: analysis.netGain,
      is_profit: analysis.isProfit,
    });
  }
}

// Example 7: V-Bucks with Battle Pass
const vbucksBattlePassCalculator = new BattlePassCalculator({
  rate: 0.00799,
  currency: "VBucks",
  symbol: "V",
  quickAmounts: [1000, 2800, 5000, 13500],
  battlePassCost: 950,
  battlePassReturn: 1500,
  storageKey: "vbucksBattlePassCalculation",
});

// Example 8: Calculator with custom validation
class ValidatedCalculator extends CurrencyCalculator {
  validateAndParseInput(value) {
    // Call parent validation first
    const baseResult = super.validateAndParseInput(value);
    if (baseResult === null) return null;

    // Custom validation rules
    if (this.config.currency === "Robux" && baseResult > 0 && baseResult < 1) {
      this.showNotification("Minimum Robux amount is 1", "warning");
      return null;
    }

    // Check for suspicious large amounts
    if (baseResult > this.config.maxValue * 0.8) {
      this.showNotification("Large amount detected - please verify", "warning");
    }

    return baseResult;
  }
}

// Example 9: Calculator with enhanced analytics
class AnalyticsCalculator extends CurrencyCalculator {
  trackCalculation(type, inputValue, outputValue) {
    // Call parent tracking
    super.trackCalculation(type, inputValue, outputValue);

    // Enhanced analytics
    this.trackEvent("detailed_calculation", {
      calculation_type: type,
      currency: this.config.currency,
      input_value: inputValue,
      output_value: outputValue,
      rate: this.config.rate,
      user_agent: navigator.userAgent,
      screen_width: screen.width,
      timestamp: Date.now(),
      session_calculations: this.getSessionCalculationCount(),
    });

    // Track value ranges for insights
    const valueRange = this.getValueRange(inputValue);
    this.trackEvent("value_range_usage", {
      currency: this.config.currency,
      range: valueRange,
      exact_value: inputValue,
    });
  }

  getValueRange(value) {
    if (value <= 100) return "micro";
    if (value <= 1000) return "small";
    if (value <= 10000) return "medium";
    if (value <= 100000) return "large";
    return "whale";
  }

  getSessionCalculationCount() {
    const key = `${this.config.currency}_session_count`;
    const count = parseInt(sessionStorage.getItem(key) || "0") + 1;
    sessionStorage.setItem(key, count.toString());
    return count;
  }
}

// Example 10: Initialization helper function
function initializeCalculator(type, customOptions = {}) {
  const calculatorConfigs = {
    robux: {
      rate: 0.0125,
      currency: "Robux",
      symbol: "R$",
      quickAmounts: [400, 800, 1700, 4500, 10000],
      maxValue: 1000000,
    },
    vbucks: {
      rate: 0.00799,
      currency: "VBucks",
      symbol: "V",
      quickAmounts: [1000, 2800, 5000, 13500],
      maxValue: 100000,
    },
    minecoins: {
      rate: 0.005,
      currency: "Minecoins",
      symbol: "MC",
      quickAmounts: [320, 840, 1720, 3500, 8000],
      maxValue: 50000,
    },
  };

  const config = calculatorConfigs[type];
  if (!config) {
    console.error(`Unknown calculator type: ${type}`);
    return null;
  }

  // Merge with custom options
  const finalConfig = { ...config, ...customOptions };

  return new CurrencyCalculator(finalConfig);
}

// Example usage of the helper function:
// const myRobuxCalc = initializeCalculator('robux', { debounceDelay: 500 });
// const myVBucksCalc = initializeCalculator('vbucks', { maxValue: 200000 });

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MultiRateCalculator,
    BattlePassCalculator,
    ValidatedCalculator,
    AnalyticsCalculator,
    initializeCalculator,
  };
}

// Global access for browser usage
window.MultiRateCalculator = MultiRateCalculator;
window.BattlePassCalculator = BattlePassCalculator;
window.ValidatedCalculator = ValidatedCalculator;
window.AnalyticsCalculator = AnalyticsCalculator;
window.initializeCalculator = initializeCalculator;
