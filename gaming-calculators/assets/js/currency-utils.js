// Currency Utilities - Shared across all calculators
// Handles exchange rate fetching, caching, and conversion

class CurrencyManager {
  constructor() {
    this.rates = {
      USD: 1.0,
      GBP: 0.78,
      EUR: 0.85,
      CAD: 1.35,
      AUD: 1.48,
    };
    this.lastFetch = 0;
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
    this.symbols = {
      USD: "$",
      GBP: "£",
      EUR: "€",
      CAD: "C$",
      AUD: "A$",
    };
  }

  // Fetch real-time exchange rates
  async fetchRates() {
    const now = Date.now();

    // Use cached rates if they're still fresh
    if (now - this.lastFetch < this.cacheDuration && this.lastFetch > 0) {
      return this.rates;
    }

    // Determine possible paths for the static JSON file based on current location
    // From gaming-calculators/robux/ -> ../../api/exchange-rates.json
    // From gaming-calculators/assets/js/ -> ../../api/exchange-rates.json
    const possiblePaths = [
      "../../api/exchange-rates.json",
      "../api/exchange-rates.json",
      "/api/exchange-rates.json",
      "api/exchange-rates.json"
    ];

    try {
      let response = null;
      let data = null;

      // Skip serverless function in development/local environment
      const isLocalDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

      if (isLocalDevelopment) {
        // In development, try static JSON paths
        for (const path of possiblePaths) {
          try {
            response = await fetch(path, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch (err) {
            continue; // Try next path
          }
        }
      } else {
        // In production, try serverless function first, then fallback to static JSON
        try {
          response = await fetch("/api/exchange-rates", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            data = await response.json();
          } else {
            // Serverless function returned error, try static JSON
            throw new Error(`API returned ${response.status}`);
          }
        } catch (apiError) {
          // Serverless function failed (expected if endpoint doesn't exist), try static JSON paths
          response = null; // Reset response
          for (const path of possiblePaths) {
            try {
              response = await fetch(path, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (response.ok) {
                data = await response.json();
                break;
              }
            } catch (err) {
              continue; // Try next path
            }
          }
        }
      }

      // Process the data if we successfully fetched it
      if (data && response && response.ok) {
        if (data.success && data.rates) {
          this.rates = data.rates;
          this.lastFetch = now;
        } else if (data.rates) {
          // Some static JSON files might not have success flag
          this.rates = data.rates;
          this.lastFetch = now;
        } else {
          console.warn("Using fallback rates: Invalid data structure");
        }
      } else {
        // If all fetches failed, keep existing fallback rates
        console.warn("Exchange rates fetch failed, using default rates");
      }
    } catch (error) {
      // Silently fail - exchange rates not critical for regional pricing
      // Keep existing rates as fallback
      console.warn("Exchange rates fetch error:", error.message);
    }

    return this.rates;
  }

  // Convert USD amount to target currency
  convertFromUSD(usdAmount, targetCurrency) {
    const rate = this.rates[targetCurrency] || 1.0;
    return usdAmount / rate;
  }

  // Convert from target currency to USD
  convertToUSD(amount, sourceCurrency) {
    const rate = this.rates[sourceCurrency] || 1.0;
    return amount * rate;
  }

  // Get currency symbol
  getSymbol(currency) {
    return this.symbols[currency] || "$";
  }

  // Format amount with currency symbol
  formatAmount(amount, currency) {
    const symbol = this.getSymbol(currency);
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  }

  // Auto-detect user's preferred currency
  detectCurrency() {
    if (typeof navigator === "undefined") return "USD";

    const lang = navigator.language.toLowerCase();

    if (lang.includes("en-gb") || lang.includes("gb")) {
      return "GBP";
    } else if (lang.includes("en-ca") || lang.includes("ca")) {
      return "CAD";
    } else if (lang.includes("en-au") || lang.includes("au")) {
      return "AUD";
    } else if (
      lang.includes("de") ||
      lang.includes("fr") ||
      lang.includes("es") ||
      lang.includes("it") ||
      lang.includes("nl") ||
      lang.includes("pt")
    ) {
      return "EUR";
    }

    return "USD";
  }

  // Get saved currency preference
  getSavedCurrency() {
    if (typeof localStorage === "undefined") return null;

    try {
      return localStorage.getItem("preferredCurrency");
    } catch (error) {
      console.warn("Could not access localStorage:", error);
      return null;
    }
  }

  // Save currency preference
  saveCurrency(currency) {
    if (typeof localStorage === "undefined") return;

    try {
      localStorage.setItem("preferredCurrency", currency);
    } catch (error) {
      console.warn("Could not save to localStorage:", error);
    }
  }
}

// Create global instance
window.currencyManager = new CurrencyManager();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = CurrencyManager;
}
