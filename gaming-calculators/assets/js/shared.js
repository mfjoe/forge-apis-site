/**
 * Gaming Calculator Shared JavaScript
 * Shared functionality for all gaming currency calculators
 */

/**
 * Load Gaming Footer Function
 * Injects a lightweight footer HTML into any element with id="footer-container"
 */
function loadGamingFooter() {
  const footerContainer = document.getElementById("footer-container");

  if (!footerContainer) {
    console.warn("Footer container not found");
    return;
  }

  const footerHTML = `
    <div class="footer-content">
      <!-- Column 1 - More Gaming Calculators -->
      <div class="footer-column">
        <h4>More Gaming Calculators</h4>
        <ul>
          <li><a href="/gaming-calculators/robux/">Robux to USD Calculator</a></li>
          <li><a href="/gaming-calculators/vbucks/">V-Bucks to USD Calculator</a></li>
          <li><a href="/gaming-calculators/minecoins/">Minecoins to USD Calculator</a></li>
          <li><a href="/gaming-calculators/fifa-points/">FIFA Points Calculator</a></li>
          <li><a href="/gaming-calculators/cod-points/">COD Points Calculator</a></li>
          <li><a href="/gaming-calculators/apex-coins/">Apex Coins Calculator</a></li>
        </ul>
      </div>

      <!-- Column 2 - Free Tools by Forge APIs -->
      <div class="footer-column">
        <h4>Free Tools by Forge APIs</h4>
        <ul>
          <li><a href="/gst-calculator/">GST Calculator India</a></li>
          <li><a href="/gaming-calculators/">Gaming Currency Calculators</a></li>
          <li><a href="/va-calculator/">VA Disability Benefits Calculator</a></li>
          <li><a href="/tip-calculator/">Restaurant Tip Calculator</a></li>
          <li><a href="/">All Tools</a></li>
        </ul>
        <p style="margin-top: 1rem; font-size: 12px; color: #6b7280;">
          Powered by Forge APIs
        </p>
      </div>

      <!-- Column 3 - Legal -->
      <div class="footer-column">
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms of Service</a></li>
          <li><a href="/cookies.html">Cookies</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      © 2024 Forge APIs. Gaming calculators are estimates only. Not affiliated with game companies.
    </div>
  `;

  footerContainer.innerHTML = footerHTML;
}

// Auto-load footer when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  if (typeof loadGamingFooter === "function") {
    loadGamingFooter();
  }
});
