/**
 * RiskScore API - Secure JavaScript
 * Move all inline JavaScript here for better security
 */

// Wrap everything in IIFE to avoid global scope pollution
(function () {
  "use strict";

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Sanitize HTML to prevent XSS
   */
  function sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Safe element text update
   */
  function safeSetText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Safe HTML update with sanitization
   */
  function safeSetHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
      // For code blocks, we trust our own output but still be careful
      element.innerHTML = html;
    }
  }

  // ============================================
  // SMOOTH SCROLLING
  // ============================================

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // ============================================
  // LANGUAGE TAB SWITCHER
  // ============================================

  const codePanels = {
    react: "react-panel",
    python: "python-panel",
    nodejs: "nodejs-panel",
  };

  function switchTab(language) {
    console.log("switchTab called with language:", JSON.stringify(language));
    console.log("language length:", language.length);
    console.log("language trimmed:", JSON.stringify(language.trim()));

    // Remove active class from all tabs and panels
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".code-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    // Add active class to clicked tab
    const trimmedLanguage = language.trim();
    console.log(
      "Looking for selector:",
      `[data-language="${trimmedLanguage}"]`
    );
    const activeButton = document.querySelector(
      `[data-language="${trimmedLanguage}"]`
    );
    if (activeButton) {
      console.log("Found active button");
      activeButton.classList.add("active");
    } else {
      console.log("Active button not found");
    }

    // Show corresponding panel
    const panelId = codePanels[trimmedLanguage];
    console.log("Panel ID:", panelId);
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) {
        console.log("Found panel, adding active class");
        panel.classList.add("active");
      } else {
        console.log("Panel not found");
      }
    }
  }

  function initTabSwitcher() {
    console.log("initTabSwitcher called");
    // Convert onclick to event listeners
    document.querySelectorAll(".tab-button").forEach((button, index) => {
      console.log(
        `Button ${index} textContent:`,
        JSON.stringify(button.textContent)
      );
      const language = button.textContent
        .trim()
        .toLowerCase()
        .replace(".js", "js");
      console.log(
        `Button ${index} processed language:`,
        JSON.stringify(language)
      );
      button.setAttribute("data-language", language);
      console.log(
        `Button ${index} data-language set to:`,
        button.getAttribute("data-language")
      );

      button.addEventListener("click", function () {
        console.log(
          "Button clicked, calling switchTab with:",
          JSON.stringify(language)
        );
        switchTab(language);
      });
    });
  }

  // ============================================
  // DEMO FUNCTIONALITY
  // ============================================

  const demoEmails = {
    disposable: "user@10minutemail.com",
    corporate: "john.smith@microsoft.com",
    suspicious: "cutegamer2010@gmail.com",
    professional: "dr.sarah.johnson@gmail.com",
  };

  function setDemoEmail(emailType) {
    const emailInput = document.getElementById("demo-email");
    if (emailInput && demoEmails[emailType]) {
      emailInput.value = demoEmails[emailType];
    }
  }

  function initDemoButtons() {
    // Sample email buttons
    const sampleButtons = [
      { selector: '[data-demo-email="disposable"]', email: "disposable" },
      { selector: '[data-demo-email="corporate"]', email: "corporate" },
      { selector: '[data-demo-email="suspicious"]', email: "suspicious" },
      { selector: '[data-demo-email="professional"]', email: "professional" },
    ];

    sampleButtons.forEach((btn) => {
      const element = document.querySelector(btn.selector);
      if (element) {
        element.addEventListener("click", () => setDemoEmail(btn.email));
      }
    });

    // Main analyze button
    const analyzeBtn = document.getElementById("analyze-btn");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", runDemo);
    }
  }

  function runDemo() {
    const emailInput = document.getElementById("demo-email");
    if (!emailInput) return;

    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const outputEl = document.getElementById("demo-output");
    const resultEl = document.getElementById("risk-result");
    const meterFill = document.getElementById("risk-meter-fill");
    const badge = document.getElementById("risk-badge");
    const message = document.getElementById("risk-message");

    // Show loading state (safely)
    if (outputEl) {
      outputEl.innerHTML = '<pre style="color: #6B7280;">Analyzing...</pre>';
    }
    if (resultEl) {
      resultEl.style.display = "none";
    }

    // Simulate API response based on email patterns
    setTimeout(() => {
      let response = analyzeEmailPattern(email);

      // Update output safely
      if (outputEl) {
        outputEl.innerHTML = formatResponseJSON(response);
      }

      // Update risk meter
      if (resultEl) {
        resultEl.style.display = "block";
      }
      if (meterFill) {
        meterFill.style.width = response.risk_score + "%";

        // Set colors based on risk
        meterFill.className = "risk-meter-fill";
        if (response.risk_score >= 70) {
          meterFill.classList.add("high");
        } else if (response.risk_score >= 40) {
          meterFill.classList.add("moderate");
        } else {
          meterFill.classList.add("low");
        }
      }

      // Update badge and message
      if (badge && message) {
        const riskLevel = getRiskLevel(response.risk_score);
        badge.className = `risk-score-badge risk-${riskLevel.class}`;
        badge.textContent = riskLevel.text;
        message.textContent = riskLevel.message;
      }
    }, 800);
  }

  function analyzeEmailPattern(email) {
    // Check for different patterns
    if (
      email.includes("10minutemail") ||
      email.includes("tempmail") ||
      email.includes("guerrilla")
    ) {
      return {
        risk_score: 97,
        confidence: 95,
        recommendation: "HIGH_RISK",
        signals_detected: [
          "🚨 Disposable email provider detected",
          "⚠️ Temporary email service",
        ],
      };
    } else if (
      email.includes("microsoft") ||
      email.includes("google") ||
      email.includes("amazon")
    ) {
      return {
        risk_score: 15,
        confidence: 85,
        recommendation: "LOW_RISK",
        signals_detected: [
          "✅ Major corporation email",
          "👔 Professional domain",
        ],
      };
    } else if (
      email.match(/\d{4}/) ||
      email.includes("gamer") ||
      email.includes("cute") ||
      email.includes("cool")
    ) {
      return {
        risk_score: 78,
        confidence: 70,
        recommendation: "HIGH_RISK",
        signals_detected: [
          "⚠️ Suspicious pattern detected",
          "🎮 Gaming-related username",
        ],
      };
    } else if (
      email.includes("dr.") ||
      email.includes("prof") ||
      email.match(/^[a-z]+\.[a-z]+@/)
    ) {
      return {
        risk_score: 25,
        confidence: 75,
        recommendation: "LOW_RISK",
        signals_detected: [
          "👔 Professional pattern",
          "✅ Formal email structure",
        ],
      };
    } else {
      return {
        risk_score: 45,
        confidence: 60,
        recommendation: "MODERATE_RISK",
        signals_detected: [
          "ℹ️ Standard email provider",
          "🔍 Additional verification recommended",
        ],
      };
    }
  }

  function formatResponseJSON(response) {
    // Safely format JSON response
    const signals = response.signals_detected
      .map((s) => `    <span class="code-string">"${sanitizeHTML(s)}"</span>`)
      .join(",\n");

    return `<pre>{
  <span class="code-key">"risk_score"</span>: <span class="code-value">${response.risk_score}</span>,
  <span class="code-key">"confidence"</span>: <span class="code-value">${response.confidence}</span>,
  <span class="code-key">"recommendation"</span>: <span class="code-string">"${response.recommendation}"</span>,
  <span class="code-key">"signals_detected"</span>: [
${signals}
  ]
}</pre>`;
  }

  function getRiskLevel(score) {
    if (score >= 70) {
      return {
        class: "high",
        text: "HIGH RISK",
        message: "Recommend blocking or manual review",
      };
    } else if (score >= 40) {
      return {
        class: "moderate",
        text: "MODERATE RISK",
        message: "Consider additional verification",
      };
    } else {
      return {
        class: "low",
        text: "LOW RISK",
        message: "Safe to proceed",
      };
    }
  }

  // ============================================
  // LEGAL PAGE HANDLER (PLACEHOLDER)
  // ============================================

  function showLegalPage(page) {
    // This should be replaced with proper routing
    console.log("Navigate to legal page:", page);
    // For now, prevent default navigation
    return false;
  }

  // Make it available globally if needed
  window.showLegalPage = showLegalPage;

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================

  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded - initializing");
    initSmoothScrolling();
    initTabSwitcher();
    initDemoButtons();
    console.log("Initialization complete");
  });
})();
