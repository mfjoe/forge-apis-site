/**
 * Gaming Calculator Core Module
 * Reusable JavaScript module for gaming currency calculators
 * Optimized for SEO, performance, and user experience
 *
 * @version 1.0.0
 * @author ForgeAPI
 */

class CurrencyCalculator {
  constructor(options = {}) {
    // Configuration
    this.config = {
      rate: options.rate || 0.01,
      currency: options.currency || "Currency",
      symbol: options.symbol || "C",
      quickAmounts: options.quickAmounts || [100, 500, 1000, 5000, 10000],
      storageKey:
        options.storageKey ||
        `${options.currency?.toLowerCase() || "currency"}Calculation`,
      debounceDelay: options.debounceDelay || 300,
      maxValue: options.maxValue || 10000000,
      decimalPlaces: options.decimalPlaces || 2,
      ...options,
    };

    // State
    this.isUpdating = false;
    this.lastCalculation = null;
    this.debounceTimer = null;
    this.animationFrame = null;

    // DOM elements (will be set during initialization)
    this.elements = {};

    // Event handlers (bound to this instance)
    this.handleInput = this.handleInput.bind(this);
    this.handleQuickAmount = this.handleQuickAmount.bind(this);
    this.copyResult = this.copyResult.bind(this);
    this.shareCalculation = this.shareCalculation.bind(this);
    this.clearInputs = this.clearInputs.bind(this);

    // Initialize if DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize the calculator
   */
  init() {
    this.bindElements();
    this.setupEventListeners();
    this.loadSavedCalculation();
    this.trackPageView();

    // Initialize performance monitoring
    this.initPerformanceTracking();

    console.log(`${this.config.currency} Calculator initialized`);
  }

  /**
   * Bind DOM elements
   */
  bindElements() {
    this.elements = {
      currencyInput:
        document.getElementById(`${this.config.currency.toLowerCase()}Input`) ||
        document.querySelector(".currency-input"),
      usdInput:
        document.getElementById("usdInput") ||
        document.querySelector(".usd-input"),
      quickButtons: document.querySelectorAll(".quick-btn"),
      copyBtn: document.getElementById("copyBtn"),
      shareBtn: document.getElementById("shareBtn"),
      clearBtn: document.getElementById("clearBtn"),
      rateInfo: document.getElementById("rateInfo"),
    };

    // Validate required elements
    if (!this.elements.currencyInput || !this.elements.usdInput) {
      console.error("Required input elements not found");
      return false;
    }

    return true;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Input event listeners with debouncing
    if (this.elements.currencyInput) {
      this.elements.currencyInput.addEventListener("input", (e) => {
        this.debouncedCalculation(() => this.handleCurrencyInput(e));
      });
    }

    if (this.elements.usdInput) {
      this.elements.usdInput.addEventListener("input", (e) => {
        this.debouncedCalculation(() => this.handleUsdInput(e));
      });
    }

    // Quick amount buttons
    this.elements.quickButtons.forEach((btn) => {
      btn.addEventListener("click", this.handleQuickAmount);
    });

    // Action buttons
    if (this.elements.copyBtn) {
      this.elements.copyBtn.addEventListener("click", this.copyResult);
    }

    if (this.elements.shareBtn) {
      this.elements.shareBtn.addEventListener("click", this.shareCalculation);
    }

    if (this.elements.clearBtn) {
      this.elements.clearBtn.addEventListener("click", this.clearInputs);
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.clearInputs();
      }

      if (
        e.ctrlKey &&
        e.key === "c" &&
        (e.target === this.elements.currencyInput ||
          e.target === this.elements.usdInput)
      ) {
        e.preventDefault();
        this.copyResult();
      }
    });
  }

  /**
   * Handle currency input with validation
   */
  handleCurrencyInput(e) {
    if (this.isUpdating) return;

    const value = this.validateAndParseInput(e.target.value);
    if (value === null) return;

    const usdValue = this.convertToUsd(value);

    this.updateWithAnimation(() => {
      this.isUpdating = true;
      this.elements.usdInput.value =
        usdValue > 0 ? this.formatCurrency(usdValue) : "";
      this.isUpdating = false;
    });

    this.saveCalculation();
    this.trackCalculation("currency_to_usd", value, usdValue);
  }

  /**
   * Handle USD input with validation
   */
  handleUsdInput(e) {
    if (this.isUpdating) return;

    const value = this.validateAndParseInput(e.target.value);
    if (value === null) return;

    const currencyValue = this.convertToCurrency(value);

    this.updateWithAnimation(() => {
      this.isUpdating = true;
      this.elements.currencyInput.value =
        currencyValue > 0 ? this.formatNumber(Math.round(currencyValue)) : "";
      this.isUpdating = false;
    });

    this.saveCalculation();
    this.trackCalculation("usd_to_currency", value, currencyValue);
  }

  /**
   * Handle quick amount button clicks
   */
  handleQuickAmount(e) {
    const amount = parseInt(
      e.target.dataset[this.config.currency.toLowerCase()] ||
        e.target.dataset.amount
    );

    if (!amount) return;

    const usdValue = this.convertToUsd(amount);

    this.updateWithAnimation(() => {
      this.elements.currencyInput.value = this.formatNumber(amount);
      this.elements.usdInput.value = this.formatCurrency(usdValue);
    });

    this.saveCalculation();
    this.trackCalculation("quick_amount", amount, usdValue);
  }

  /**
   * Convert currency to USD
   */
  convertToUsd(currencyAmount) {
    return currencyAmount * this.config.rate;
  }

  /**
   * Convert USD to currency
   */
  convertToCurrency(usdAmount) {
    return usdAmount / this.config.rate;
  }

  /**
   * Validate and parse input value
   */
  validateAndParseInput(value) {
    // Remove commas and whitespace
    const cleanValue = value.replace(/[,\s]/g, "");

    // Check if it's a valid number
    if (!/^\d*\.?\d*$/.test(cleanValue)) {
      return null;
    }

    const numValue = parseFloat(cleanValue) || 0;

    // Check maximum value
    if (numValue > this.config.maxValue) {
      this.showNotification(
        `Maximum value is ${this.formatNumber(this.config.maxValue)}`,
        "warning"
      );
      return null;
    }

    return numValue;
  }

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return Math.round(num).toLocaleString();
  }

  /**
   * Format currency with specified decimal places
   */
  formatCurrency(amount) {
    return amount.toFixed(this.config.decimalPlaces);
  }

  /**
   * Debounced calculation to improve performance
   */
  debouncedCalculation(callback) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(callback, this.config.debounceDelay);
  }

  /**
   * Update UI with animation frame for smooth performance
   */
  updateWithAnimation(callback) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(callback);
  }

  /**
   * Copy result to clipboard
   */
  async copyResult() {
    const currencyValue = this.elements.currencyInput.value || "0";
    const usdValue = this.elements.usdInput.value || "0";

    const result = `${currencyValue} ${this.config.currency} = $${usdValue} USD`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(result);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = result;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      this.showNotification("Result copied to clipboard!", "success");
      this.trackEvent("copy_result", {
        currency: this.config.currency,
        value: currencyValue,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      this.showNotification("Failed to copy result", "error");
    }
  }

  /**
   * Share calculation using Web Share API
   */
  async shareCalculation() {
    const currencyValue = this.elements.currencyInput.value || "0";
    const usdValue = this.elements.usdInput.value || "0";

    const shareData = {
      title: `${this.config.currency} to USD Calculator Result`,
      text: `${currencyValue} ${this.config.currency} = $${usdValue} USD`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.trackEvent("share_native", { currency: this.config.currency });
      } else {
        // Fallback to copying
        await this.copyResult();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share failed:", err);
        await this.copyResult();
      }
    }
  }

  /**
   * Clear all inputs
   */
  clearInputs() {
    this.updateWithAnimation(() => {
      this.elements.currencyInput.value = "";
      this.elements.usdInput.value = "";
    });

    localStorage.removeItem(this.config.storageKey);
    this.showNotification("Calculator cleared!", "info");
    this.trackEvent("clear_calculator", { currency: this.config.currency });
  }

  /**
   * Save calculation to localStorage
   */
  saveCalculation() {
    const calculation = {
      currency: this.elements.currencyInput.value,
      usd: this.elements.usdInput.value,
      timestamp: Date.now(),
      rate: this.config.rate,
    };

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(calculation));
      this.lastCalculation = calculation;
    } catch (err) {
      console.warn("Failed to save calculation:", err);
    }
  }

  /**
   * Load saved calculation from localStorage
   */
  loadSavedCalculation() {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (!saved) return;

      const calculation = JSON.parse(saved);

      // Only load if saved within last 24 hours
      if (Date.now() - calculation.timestamp < 24 * 60 * 60 * 1000) {
        this.updateWithAnimation(() => {
          this.elements.currencyInput.value = calculation.currency || "";
          this.elements.usdInput.value = calculation.usd || "";
        });

        this.lastCalculation = calculation;
      }
    } catch (err) {
      console.warn("Failed to load saved calculation:", err);
    }
  }

  /**
   * Show notification to user
   */
  showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelectorAll(".calc-notification");
    existing.forEach((el) => el.remove());

    const notification = document.createElement("div");
    notification.className = `calc-notification calc-notification--${type}`;
    notification.textContent = message;

    // Styling
    Object.assign(notification.style, {
      position: "fixed",
      top: "100px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "8px",
      zIndex: "10000",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      fontSize: "14px",
      maxWidth: "300px",
      wordWrap: "break-word",
      transition: "all 0.3s ease",
    });

    // Type-specific styling
    const colors = {
      success: { bg: "#10b981", color: "#fff" },
      error: { bg: "#ef4444", color: "#fff" },
      warning: { bg: "#f59e0b", color: "#fff" },
      info: { bg: "#3b82f6", color: "#fff" },
    };

    const colorScheme = colors[type] || colors.info;
    notification.style.background = colorScheme.bg;
    notification.style.color = colorScheme.color;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  }

  /**
   * Track calculation events for analytics
   */
  trackCalculation(type, inputValue, outputValue) {
    this.trackEvent("calculation", {
      calculation_type: type,
      currency: this.config.currency,
      input_value: inputValue,
      output_value: outputValue,
      rate: this.config.rate,
    });
  }

  /**
   * Track page view
   */
  trackPageView() {
    this.trackEvent("page_view", {
      page_title: document.title,
      currency: this.config.currency,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
    });
  }

  /**
   * Initialize performance tracking
   */
  initPerformanceTracking() {
    // Track time on page
    this.startTime = Date.now();

    // Track scroll depth
    this.maxScrollDepth = 0;
    this.trackScrollDepth();

    // Track user engagement
    this.trackUserEngagement();

    // Track page unload
    window.addEventListener("beforeunload", () => {
      const timeOnPage = Date.now() - this.startTime;
      this.trackEvent("page_unload", {
        time_on_page: timeOnPage,
        max_scroll_depth: this.maxScrollDepth,
        calculations_made: this.calculationCount || 0,
      });
    });
  }

  /**
   * Track scroll depth for engagement metrics
   */
  trackScrollDepth() {
    let ticking = false;

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;

        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.trackEvent("scroll_depth", {
            depth_percent: scrollPercent,
            currency: this.config.currency,
          });
        }
      }

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });
  }

  /**
   * Track user engagement metrics
   */
  trackUserEngagement() {
    let isActive = true;
    let lastActivity = Date.now();

    // Track user activity
    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
      (event) => {
        document.addEventListener(
          event,
          () => {
            lastActivity = Date.now();
            if (!isActive) {
              isActive = true;
              this.trackEvent("user_active", {
                currency: this.config.currency,
              });
            }
          },
          { passive: true }
        );
      }
    );

    // Check for inactivity every 30 seconds
    setInterval(() => {
      if (Date.now() - lastActivity > 30000 && isActive) {
        isActive = false;
        this.trackEvent("user_inactive", {
          currency: this.config.currency,
          inactive_after: Date.now() - lastActivity,
        });
      }
    }, 30000);
  }

  /**
   * Generic event tracking function
   */
  trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, {
        currency_type: this.config.currency,
        ...parameters,
      });
    }

    // Google Analytics Universal (fallback)
    if (typeof ga !== "undefined") {
      ga(
        "send",
        "event",
        "Calculator",
        eventName,
        this.config.currency,
        parameters.value
      );
    }

    // Console log for debugging
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      console.log("Analytics Event:", eventName, parameters);
    }
  }
}

/**
 * Ad Optimization Manager
 * Handles lazy loading and refresh of advertisements
 */
class AdManager {
  constructor(options = {}) {
    this.config = {
      refreshInterval: options.refreshInterval || 60000, // 60 seconds
      viewabilityThreshold: options.viewabilityThreshold || 0.5,
      maxRefreshes: options.maxRefreshes || 10,
      ...options,
    };

    this.refreshCount = 0;
    this.isUserActive = true;
    this.observers = new Map();

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.trackUserActivity();
    this.startRefreshTimer();
  }

  /**
   * Setup intersection observer for ad viewability
   */
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const adSlot = entry.target;

          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= this.viewabilityThreshold
          ) {
            this.loadAd(adSlot);
            this.trackAdViewability(adSlot, true);
          } else {
            this.trackAdViewability(adSlot, false);
          }
        });
      },
      {
        threshold: [0, this.config.viewabilityThreshold, 1],
      }
    );

    // Observe all ad slots
    document.querySelectorAll(".ad-slot, [data-ad-slot]").forEach((adSlot) => {
      observer.observe(adSlot);
      this.observers.set(adSlot, observer);
    });
  }

  /**
   * Load advertisement in slot
   */
  loadAd(adSlot) {
    if (adSlot.dataset.loaded === "true") return;

    // Mark as loaded to prevent duplicate loading
    adSlot.dataset.loaded = "true";

    // Load AdSense ads
    if (typeof adsbygoogle !== "undefined") {
      const adElements = adSlot.querySelectorAll(".adsbygoogle");
      adElements.forEach((ad) => {
        if (!ad.dataset.adsbygoogleStatus) {
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.warn("AdSense loading failed:", e);
          }
        }
      });
    }

    this.trackEvent("ad_loaded", {
      slot_id: adSlot.id || "unknown",
      position: this.getAdPosition(adSlot),
    });
  }

  /**
   * Track user activity for ad refresh eligibility
   */
  trackUserActivity() {
    let lastActivity = Date.now();

    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
      (event) => {
        document.addEventListener(
          event,
          () => {
            lastActivity = Date.now();
            this.isUserActive = true;
          },
          { passive: true }
        );
      }
    );

    // Check activity every 10 seconds
    setInterval(() => {
      this.isUserActive = Date.now() - lastActivity < 30000;
    }, 10000);
  }

  /**
   * Start ad refresh timer
   */
  startRefreshTimer() {
    if (this.refreshCount >= this.config.maxRefreshes) return;

    setTimeout(() => {
      if (this.isUserActive && this.refreshCount < this.config.maxRefreshes) {
        this.refreshAds();
        this.refreshCount++;
        this.startRefreshTimer();
      }
    }, this.config.refreshInterval);
  }

  /**
   * Refresh visible ads
   */
  refreshAds() {
    const visibleAds = document.querySelectorAll(
      '.ad-slot[data-loaded="true"]'
    );

    visibleAds.forEach((adSlot) => {
      // Check if ad is still in viewport
      const rect = adSlot.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        this.refreshAdSlot(adSlot);
      }
    });

    this.trackEvent("ads_refreshed", {
      refresh_count: this.refreshCount,
      visible_ads: visibleAds.length,
    });
  }

  /**
   * Refresh specific ad slot
   */
  refreshAdSlot(adSlot) {
    // Implementation depends on ad network
    // For AdSense, you would typically need to use GPT or similar
    console.log("Refreshing ad slot:", adSlot.id);

    this.trackEvent("ad_refreshed", {
      slot_id: adSlot.id || "unknown",
      refresh_count: this.refreshCount,
    });
  }

  /**
   * Track ad viewability
   */
  trackAdViewability(adSlot, isViewable) {
    this.trackEvent("ad_viewability", {
      slot_id: adSlot.id || "unknown",
      is_viewable: isViewable,
      position: this.getAdPosition(adSlot),
    });
  }

  /**
   * Get ad position on page
   */
  getAdPosition(adSlot) {
    const rect = adSlot.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const position = rect.top + scrollTop;

    if (position < window.innerHeight) return "above_fold";
    if (position < window.innerHeight * 2) return "below_fold";
    return "deep_scroll";
  }

  /**
   * Track events
   */
  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, parameters);
    }

    if (window.location.hostname === "localhost") {
      console.log("Ad Event:", eventName, parameters);
    }
  }
}

/**
 * SEO and Performance Utilities
 */
class SEOTracker {
  constructor() {
    this.startTime = performance.now();
    this.init();
  }

  init() {
    this.trackCoreWebVitals();
    this.trackUserBehavior();
    this.setupStructuredDataValidation();
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.trackEvent("core_web_vitals", {
            metric: "LCP",
            value: Math.round(lastEntry.startTime),
            rating:
              lastEntry.startTime < 2500
                ? "good"
                : lastEntry.startTime < 4000
                ? "needs_improvement"
                : "poor",
          });
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        console.warn("LCP tracking failed:", e);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.trackEvent("core_web_vitals", {
              metric: "FID",
              value: Math.round(entry.processingStart - entry.startTime),
              rating:
                entry.processingStart - entry.startTime < 100
                  ? "good"
                  : entry.processingStart - entry.startTime < 300
                  ? "needs_improvement"
                  : "poor",
            });
          });
        });

        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch (e) {
        console.warn("FID tracking failed:", e);
      }
    }

    // Cumulative Layout Shift
    this.trackCLS();
  }

  /**
   * Track Cumulative Layout Shift
   */
  trackCLS() {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    if ("PerformanceObserver" in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry =
                sessionEntries[sessionEntries.length - 1];

              if (
                sessionValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000
              ) {
                sessionValue += entry.value;
                sessionEntries.push(entry);
              } else {
                sessionValue = entry.value;
                sessionEntries = [entry];
              }

              if (sessionValue > clsValue) {
                clsValue = sessionValue;

                this.trackEvent("core_web_vitals", {
                  metric: "CLS",
                  value: Math.round(clsValue * 1000) / 1000,
                  rating:
                    clsValue < 0.1
                      ? "good"
                      : clsValue < 0.25
                      ? "needs_improvement"
                      : "poor",
                });
              }
            }
          }
        });

        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        console.warn("CLS tracking failed:", e);
      }
    }
  }

  /**
   * Track user behavior for SEO insights
   */
  trackUserBehavior() {
    // Track bounce rate indicators
    let hasEngaged = false;

    const engagementEvents = ["click", "scroll", "keydown", "touchstart"];
    const trackEngagement = () => {
      if (!hasEngaged) {
        hasEngaged = true;
        this.trackEvent("user_engagement", {
          engaged: true,
          time_to_engagement: performance.now() - this.startTime,
        });
      }
    };

    engagementEvents.forEach((event) => {
      document.addEventListener(event, trackEngagement, {
        once: true,
        passive: true,
      });
    });

    // Track if user is still not engaged after 10 seconds
    setTimeout(() => {
      if (!hasEngaged) {
        this.trackEvent("user_engagement", {
          engaged: false,
          time_on_page: performance.now() - this.startTime,
        });
      }
    }, 10000);
  }

  /**
   * Validate structured data
   */
  setupStructuredDataValidation() {
    const structuredDataScripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    structuredDataScripts.forEach((script, index) => {
      try {
        const data = JSON.parse(script.textContent);
        this.trackEvent("structured_data_valid", {
          script_index: index,
          type: data["@type"] || "unknown",
        });
      } catch (e) {
        this.trackEvent("structured_data_error", {
          script_index: index,
          error: e.message,
        });
      }
    });
  }

  /**
   * Track events
   */
  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, parameters);
    }

    if (window.location.hostname === "localhost") {
      console.log("SEO Event:", eventName, parameters);
    }
  }
}

// Auto-initialize managers when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize ad manager
  if (document.querySelector(".ad-slot, [data-ad-slot]")) {
    window.adManager = new AdManager();
  }

  // Initialize SEO tracker
  window.seoTracker = new SEOTracker();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CurrencyCalculator, AdManager, SEOTracker };
}

// Global access
window.CurrencyCalculator = CurrencyCalculator;
window.AdManager = AdManager;
window.SEOTracker = SEOTracker;
