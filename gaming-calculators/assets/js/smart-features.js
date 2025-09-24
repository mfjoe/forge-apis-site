// Smart Features for Gaming Calculators
// Shared functionality for Spending Tracker and Deal Finder

class SpendingTracker {
  constructor(calculatorName, currencyName) {
    this.calculatorName = calculatorName;
    this.currencyName = currencyName;
    this.storageKey = `${calculatorName}-history`;
    this.maxHistory = 50;
    this.history = this.loadHistory();
    this.initializeElements();
    this.setupEventListeners();
    this.updateDisplay();
  }

  initializeElements() {
    this.totalAmountEl = document.getElementById("totalAmount");
    this.currencyNameEl = document.getElementById("currencyName");
    this.totalValueEl = document.getElementById("totalValue");
    this.calcCountEl = document.getElementById("calcCount");
    this.viewHistoryBtn = document.getElementById("viewHistory");
    this.clearHistoryBtn = document.getElementById("clearHistory");
    this.trackerDetails = document.getElementById("trackerDetails");
    this.historyList = document.getElementById("historyList");
    this.exportBtn = document.getElementById("exportHistory");
  }

  setupEventListeners() {
    console.log("Setting up event listeners for", this.calculatorName);
    console.log("Elements found:", {
      viewHistoryBtn: !!this.viewHistoryBtn,
      clearHistoryBtn: !!this.clearHistoryBtn,
      exportBtn: !!this.exportBtn,
    });

    this.viewHistoryBtn.addEventListener("click", () => this.toggleHistory());
    this.clearHistoryBtn.addEventListener("click", () => {
      console.log("Clear button clicked for", this.calculatorName);
      this.clearHistory();
    });
    this.exportBtn.addEventListener("click", () => this.exportHistory());
  }

  loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const history = JSON.parse(stored);
        // Clean up old entries (older than 90 days)
        const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
        return history.filter((item) => item.timestamp > cutoff);
      }
    } catch (e) {
      console.warn("Failed to load spending history:", e);
    }
    return [];
  }

  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (e) {
      console.warn("Failed to save spending history:", e);
      // If storage is full, remove oldest entries
      if (e.name === "QuotaExceededError") {
        this.history = this.history.slice(-25);
        localStorage.setItem(this.storageKey, JSON.stringify(this.history));
      }
    }
  }

  addCalculation(gameAmount, gameCurrency, currencyAmount, currencyType) {
    const calculation = {
      timestamp: Date.now(),
      gameAmount: gameAmount,
      gameCurrency: gameCurrency,
      currencyAmount: currencyAmount,
      currencyType: currencyType,
    };

    this.history.unshift(calculation);

    // Keep only the most recent calculations
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }

    this.saveHistory();
    this.updateDisplay();
  }

  updateDisplay() {
    const totalGameAmount = this.history.reduce(
      (sum, calc) => sum + calc.gameAmount,
      0
    );
    const totalCurrencyValue = this.history.reduce(
      (sum, calc) => sum + calc.currencyAmount,
      0
    );
    const calcCount = this.history.length;

    this.totalAmountEl.textContent = totalGameAmount.toLocaleString();
    this.currencyNameEl.textContent = this.currencyName;
    this.totalValueEl.textContent = `$${totalCurrencyValue.toFixed(2)}`;
    this.calcCountEl.textContent = calcCount;

    // Update currency name based on current selection
    if (window.currencyManager) {
      this.currencyNameEl.textContent = this.currencyName;
    }
  }

  toggleHistory() {
    const isVisible = this.trackerDetails.style.display !== "none";
    this.trackerDetails.style.display = isVisible ? "none" : "block";
    this.viewHistoryBtn.textContent = isVisible
      ? "See Details"
      : "Hide Details";

    if (!isVisible) {
      this.renderHistory();
    }
  }

  renderHistory() {
    const recentHistory = this.history.slice(0, 10);
    this.historyList.innerHTML = "";

    if (recentHistory.length === 0) {
      this.historyList.innerHTML =
        '<p style="color: var(--gray); font-style: italic;">No calculations yet</p>';
      return;
    }

    recentHistory.forEach((calc) => {
      const item = document.createElement("div");
      item.className = "history-item";
      const date = new Date(calc.timestamp).toLocaleDateString();
      const time = new Date(calc.timestamp).toLocaleTimeString();
      item.innerHTML = `
        <div><strong>${calc.gameAmount.toLocaleString()} ${
        this.currencyName
      }</strong> = ${
        window.currencyManager
          ? window.currencyManager.getSymbol(calc.currencyType)
          : "$"
      }${calc.currencyAmount.toFixed(2)} ${calc.currencyType}</div>
        <div style="color: var(--gray); font-size: 0.8rem;">${date} at ${time}</div>
      `;
      this.historyList.appendChild(item);
    });
  }

  clearHistory() {
    this.showConfirmModal();
  }

  showConfirmModal() {
    console.log("showConfirmModal called");
    const modal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("modalConfirm");
    const cancelBtn = document.getElementById("modalCancel");

    console.log("Modal elements in showConfirmModal:", {
      modal: !!modal,
      confirmBtn: !!confirmBtn,
      cancelBtn: !!cancelBtn,
    });

    if (!modal) {
      console.error("Modal not found! Falling back to confirm dialog.");
      if (confirm("Are you sure you want to clear your calculation history?")) {
        this.history = [];
        this.saveHistory();
        this.updateDisplay();
        this.trackerDetails.style.display = "none";
        this.viewHistoryBtn.textContent = "See Details";
        if (typeof showNotification === "function") {
          showNotification("History cleared!");
        }
      }
      return;
    }

    modal.classList.add("show");
    console.log("Modal shown, setting up event listeners...");

    // Handle confirm action
    const handleConfirm = () => {
      console.log("Confirm button clicked in modal");
      this.history = [];
      this.saveHistory();
      this.updateDisplay();
      this.trackerDetails.style.display = "none";
      this.viewHistoryBtn.textContent = "See Details";
      if (typeof showNotification === "function") {
        showNotification("History cleared!");
      }
      this.hideConfirmModal();
    };

    // Handle cancel action
    const handleCancel = () => {
      console.log("Cancel button clicked in modal");
      this.hideConfirmModal();
    };

    // Remove existing listeners to prevent duplicates
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));

    // Add new listeners
    document
      .getElementById("modalConfirm")
      .addEventListener("click", handleConfirm);
    document
      .getElementById("modalCancel")
      .addEventListener("click", handleCancel);

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        handleCancel();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCancel();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }

  hideConfirmModal() {
    const modal = document.getElementById("confirmModal");
    modal.classList.remove("show");
  }

  exportHistory() {
    if (this.history.length === 0) {
      if (typeof showNotification === "function") {
        showNotification("No data to export");
      }
      return;
    }

    const csvContent = [
      ["Date", "Time", this.currencyName, "Currency", "Amount", "Value"],
      ...this.history.map((calc) => [
        new Date(calc.timestamp).toLocaleDateString(),
        new Date(calc.timestamp).toLocaleTimeString(),
        calc.gameAmount,
        calc.currencyType,
        `${
          window.currencyManager
            ? window.currencyManager.getSymbol(calc.currencyType)
            : "$"
        }${calc.currencyAmount.toFixed(2)}`,
        calc.currencyAmount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.calculatorName}-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    if (typeof showNotification === "function") {
      showNotification("History exported successfully!");
    }
  }
}

class DealFinder {
  constructor(calculatorType) {
    this.packages = this.getPackages(calculatorType);
    this.dealFinder = document.getElementById("dealFinder");
    this.dealTip = document.getElementById("dealTip");
  }

  getPackages(type) {
    const packages = {
      vbucks: [
        { amount: 1000, price: 7.99, bonus: 0 },
        { amount: 2800, price: 19.99, bonus: 300 },
        { amount: 5000, price: 31.99, bonus: 1000 },
        { amount: 13500, price: 79.99, bonus: 4500 },
      ],
      robux: [
        { amount: 400, price: 4.99, rate: 0.0125 },
        { amount: 800, price: 9.99, rate: 0.0125 },
        { amount: 1700, price: 19.99, rate: 0.0118 },
        { amount: 4500, price: 49.99, rate: 0.0111 },
        { amount: 10000, price: 99.99, rate: 0.01 },
      ],
      fifa: [
        { amount: 500, price: 4.99, rate: 0.00998 },
        { amount: 1000, price: 9.99, rate: 0.00999 },
        { amount: 2000, price: 19.99, rate: 0.009995 },
        { amount: 5000, price: 49.99, rate: 0.009998 },
        { amount: 12000, price: 99.99, rate: 0.00833 },
      ],
      cod: [
        { amount: 200, price: 1.99, rate: 0.00995 },
        { amount: 500, price: 4.99, rate: 0.00998 },
        { amount: 1000, price: 9.99, rate: 0.00999 },
        { amount: 2000, price: 19.99, rate: 0.009995 },
        { amount: 5000, price: 49.99, rate: 0.009998 },
      ],
      apex: [
        { amount: 1000, price: 9.99, rate: 0.00999 },
        { amount: 2000, price: 19.99, rate: 0.009995 },
        { amount: 5000, price: 49.99, rate: 0.009998 },
        { amount: 10000, price: 99.99, rate: 0.009999 },
      ],
      minecoins: [
        { amount: 320, price: 1.99, rate: 0.0062 },
        { amount: 640, price: 3.99, rate: 0.0062 },
        { amount: 1600, price: 9.99, rate: 0.0062 },
        { amount: 3200, price: 19.99, rate: 0.0062 },
        { amount: 8000, price: 49.99, rate: 0.0062 },
      ],
    };
    return packages[type] || [];
  }

  checkDeal(gameAmount, currencyAmount, currencyType) {
    const packages = this.packages;
    let bestDeal = null;

    // Check if user is close to a better package
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];

      if (gameAmount >= pkg.amount * 0.8 && gameAmount < pkg.amount) {
        // User is 80%+ of the way to a package
        const needed = pkg.amount - gameAmount;
        const neededPrice = (needed * pkg.price) / pkg.amount;
        bestDeal = {
          type: "upgrade",
          message: this.getUpgradeMessage(pkg, needed, neededPrice),
          savings: pkg.amount - gameAmount,
        };
        break;
      } else if (
        gameAmount > pkg.amount &&
        gameAmount < packages[i + 1]?.amount
      ) {
        // User is between packages
        const nextPkg = packages[i + 1];
        if (nextPkg) {
          const additionalCost = nextPkg.price - pkg.price;
          const additionalAmount = nextPkg.amount - pkg.amount;
          bestDeal = {
            type: "better",
            message: this.getBetterDealMessage(
              nextPkg,
              additionalCost,
              additionalAmount
            ),
            savings: additionalAmount,
          };
        }
        break;
      }
    }

    if (bestDeal) {
      this.showDeal(bestDeal.message);
    } else {
      this.hideDeal();
    }
  }

  getUpgradeMessage(pkg, needed, neededPrice) {
    const currencyName = this.getCurrencyName();
    return `💡 Tip: For just ${needed.toLocaleString()} more ${currencyName}, you get better value with the ${pkg.amount.toLocaleString()} package`;
  }

  getBetterDealMessage(nextPkg, additionalCost, additionalAmount) {
    const currencyName = this.getCurrencyName();
    const bonusText = nextPkg.bonus
      ? ` with ${nextPkg.bonus.toLocaleString()} bonus ${currencyName}`
      : "";
    return `💡 Better Deal: The ${nextPkg.amount.toLocaleString()} package gives you ${additionalAmount.toLocaleString()} more ${currencyName}${bonusText} for only $${additionalCost.toFixed(
      2
    )} more`;
  }

  getCurrencyName() {
    // Try to get currency name from the page
    const currencyNameEl = document.getElementById("currencyName");
    return currencyNameEl ? currencyNameEl.textContent : "currency";
  }

  showDeal(message) {
    this.dealTip.innerHTML = message;
    this.dealFinder.style.display = "block";
  }

  hideDeal() {
    this.dealFinder.style.display = "none";
  }
}

// Export for use in calculator pages
window.SpendingTracker = SpendingTracker;
window.DealFinder = DealFinder;
