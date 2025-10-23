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

    try {
      let response;

      // Skip serverless function in development/local environment
      const isLocalDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

      if (isLocalDevelopment) {
        response = await fetch("../../api/exchange-rates.json", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Try the serverless function first in production
        response = await fetch("/api/exchange-rates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // If serverless function fails, try the static JSON file
        if (!response.ok) {
          response = await fetch("../../api/exchange-rates.json", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.rates) {
        this.rates = data.rates;
        this.lastFetch = now;
      } else {
        console.warn("Using fallback rates:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      // Keep existing rates as fallback
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
