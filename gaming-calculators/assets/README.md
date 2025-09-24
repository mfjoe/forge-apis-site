# Gaming Calculator Core Module

A comprehensive, reusable JavaScript module for creating gaming currency calculators with advanced SEO tracking, ad optimization, and performance features.

## Features

### 🧮 CurrencyCalculator Class

- **Two-way conversion** between gaming currency and USD
- **Input validation** with custom rules and limits
- **Number formatting** with commas and proper decimals
- **Quick amount buttons** for common values
- **Copy to clipboard** functionality
- **Share functionality** using Web Share API
- **LocalStorage** for saving last calculation
- **Debounced calculations** for performance
- **RequestAnimationFrame** for smooth UI updates

### 📊 SEO & Analytics

- **Google Analytics 4** event tracking
- **Core Web Vitals** monitoring (LCP, FID, CLS)
- **User engagement** metrics
- **Scroll depth** tracking
- **Time on page** tracking
- **Bounce rate** optimization
- **Structured data** validation

### 💰 Ad Optimization

- **Lazy loading** ads when in viewport
- **Auto-refresh** ads every 60 seconds (if user active)
- **Viewability tracking** with intersection observer
- **Performance monitoring** for ad impact

### ⚡ Performance Features

- **Debounced input** calculations (300ms default)
- **RequestAnimationFrame** for UI updates
- **Intersection Observer** for ad loading
- **Memory management** with cleanup
- **Web Workers** ready (for future heavy calculations)

## Quick Start

### 1. Include the Files

```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/calculator-core.css" />

<!-- JavaScript -->
<script src="assets/js/calculator-core.js"></script>
```

### 2. Basic Usage

```javascript
// Simple Robux calculator
const robuxCalc = new CurrencyCalculator({
  rate: 0.0125,
  currency: "Robux",
  quickAmounts: [400, 800, 1700, 4500, 10000],
});
```

### 3. HTML Structure

Your HTML should include these elements:

```html
<div class="calculator-container">
  <!-- Currency Input -->
  <input
    type="number"
    id="robuxInput"
    class="calculator-input"
    placeholder="Enter Robux amount"
  />

  <!-- USD Input -->
  <input
    type="number"
    id="usdInput"
    class="calculator-input"
    placeholder="Enter USD amount"
  />

  <!-- Quick Amount Buttons -->
  <button class="quick-btn" data-robux="400">400 R$</button>
  <button class="quick-btn" data-robux="800">800 R$</button>

  <!-- Action Buttons -->
  <button id="copyBtn" class="action-btn">Copy Result</button>
  <button id="shareBtn" class="action-btn">Share</button>
  <button id="clearBtn" class="action-btn">Clear</button>

  <!-- Rate Info Display -->
  <div id="rateInfo"></div>
</div>
```

## Configuration Options

```javascript
const calculator = new CurrencyCalculator({
  // Required
  rate: 0.0125, // Exchange rate (USD per currency unit)
  currency: "Robux", // Currency name

  // Optional
  symbol: "R$", // Currency symbol
  quickAmounts: [400, 800, 1700], // Quick amount buttons
  storageKey: "robuxCalculation", // LocalStorage key
  debounceDelay: 300, // Input debounce delay (ms)
  maxValue: 1000000, // Maximum input value
  decimalPlaces: 2, // USD decimal places

  // Advanced
  enableAnalytics: true, // Enable tracking
  enableAds: true, // Enable ad optimization
  customValidation: function (val) {
    /* custom logic */
  },
});
```

## Advanced Usage Examples

### Multi-Rate Calculator (Robux with DevEx)

```javascript
class RobuxCalculator extends CurrencyCalculator {
  constructor() {
    super({
      rate: 0.0125, // Default to purchase rate
      currency: "Robux",
      quickAmounts: [400, 800, 1700, 4500, 10000],
    });

    this.rates = {
      purchase: 0.0125, // Player purchase rate
      devex: 0.0035, // Developer Exchange rate
      marketplace: 0.00875, // After 30% tax
    };
  }

  switchMode(mode) {
    this.config.rate = this.rates[mode];
    this.recalculate();
  }
}
```

### Battle Pass Calculator

```javascript
const vbucksCalc = new CurrencyCalculator({
  rate: 0.00799,
  currency: "VBucks",
  quickAmounts: [1000, 2800, 5000, 13500],
});

// Calculate Battle Pass value
function calculateBattlePassValue() {
  const cost = 950; // V-Bucks cost
  const earned = 1500; // V-Bucks earned back
  const netGain = earned - cost;

  return {
    cost: vbucksCalc.convertToUsd(cost),
    earned: vbucksCalc.convertToUsd(earned),
    netGain: vbucksCalc.convertToUsd(netGain),
  };
}
```

## Analytics Events

The module automatically tracks these events:

### Calculator Events

- `calculation` - When user performs conversion
- `quick_amount` - When quick button is clicked
- `copy_result` - When result is copied
- `share_calculation` - When result is shared
- `clear_calculator` - When calculator is cleared

### SEO Events

- `page_view` - Page load with metadata
- `user_engagement` - User interaction tracking
- `scroll_depth` - 25%, 50%, 75%, 90% milestones
- `core_web_vitals` - LCP, FID, CLS measurements

### Ad Events

- `ad_loaded` - When ad enters viewport
- `ad_viewability` - Viewability changes
- `ad_refreshed` - When ad is refreshed

## Customization

### Custom Validation

```javascript
const calculator = new CurrencyCalculator({
  rate: 0.0125,
  currency: "Robux",
  customValidation: function (value) {
    if (value < 1) {
      this.showNotification("Minimum 1 Robux required", "warning");
      return false;
    }
    return true;
  },
});
```

### Custom Notifications

```javascript
calculator.showNotification("Custom message", "success");
// Types: 'success', 'error', 'warning', 'info'
```

### Custom Analytics

```javascript
calculator.trackEvent("custom_event", {
  custom_parameter: "value",
  currency: calculator.config.currency,
});
```

## Browser Support

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Features**: ES6 classes, Intersection Observer, Web Share API
- **Fallbacks**: Included for older browsers where possible

## Performance

- **Debounced calculations**: Prevents excessive computation
- **RequestAnimationFrame**: Smooth UI updates
- **Lazy loading**: Ads load only when visible
- **Memory management**: Automatic cleanup of timers and observers
- **Optimized DOM**: Minimal reflows and repaints

## SEO Benefits

- **Core Web Vitals**: Automatic monitoring and optimization
- **User engagement**: Detailed interaction tracking
- **Bounce rate**: Improved through engagement metrics
- **Analytics**: Rich data for SEO insights
- **Performance**: Fast loading and smooth interactions

## File Structure

```
gaming-calculators/assets/
├── css/
│   └── calculator-core.css     # Core styles and animations
├── js/
│   ├── calculator-core.js      # Main module
│   └── calculator-examples.js  # Usage examples
└── README.md                   # This documentation
```

## Integration with Existing Calculators

To upgrade existing calculators to use this module:

1. Include the core files
2. Replace inline JavaScript with module usage
3. Update HTML to match expected structure
4. Configure for specific currency

Example migration:

```javascript
// Old inline code
let robuxValue = parseFloat(input.value) * 0.0125;

// New module usage
const calc = new CurrencyCalculator({
  rate: 0.0125,
  currency: "Robux",
});
```

## License

This module is part of the ForgeAPI gaming calculators project.

## Support

For issues or questions, please check the examples in `calculator-examples.js` or review the inline documentation in `calculator-core.js`.
