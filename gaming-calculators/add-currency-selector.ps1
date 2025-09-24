# PowerShell script to add currency selector to all calculator pages
# This script adds the currency selector HTML, CSS, and JavaScript to all calculator pages

$calculatorPages = @(
    "minecoins/index.html",
    "fifa-points/index.html", 
    "cod-points/index.html",
    "apex-coins/index.html",
    "robux/tax-calculator.html"
)

# Currency selector HTML template
$currencyHTML = @"
        <!-- Currency Selector -->
        <div class="currency-selector">
          <label for="currency-select" class="currency-label">Currency:</label>
          <select id="currency-select" class="currency-dropdown">
            <option value="USD">🇺🇸 USD - US Dollar</option>
            <option value="GBP">🇬🇧 GBP - British Pound</option>
            <option value="EUR">🇪🇺 EUR - Euro</option>
            <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
            <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
          </select>
        </div>
"@

# Currency selector CSS template
$currencyCSS = @"
      /* Currency Selector */
      .currency-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--light-gray);
        border-radius: 8px;
      }

      .currency-label {
        font-weight: 600;
        color: var(--dark);
        font-size: 0.9rem;
      }

      .currency-dropdown {
        padding: 0.5rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        background: var(--white);
        font-weight: 500;
        cursor: pointer;
        transition: border-color 0.3s ease;
        min-width: 200px;
      }

      .currency-dropdown:focus {
        outline: none;
        border-color: var(--primary);
      }

      .currency-dropdown:hover {
        border-color: var(--primary);
      }
"@

foreach ($page in $calculatorPages) {
    Write-Host "Processing: $page"
    
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        
        # Add currency selector HTML after calculator header
        $content = $content -replace '(<div class="calculator-header">.*?</div>)', "`$1`n$currencyHTML"
        
        # Add currency selector CSS before action-buttons
        $content = $content -replace '(\s+\.action-buttons)', "`n$currencyCSS`n`$1"
        
        # Update input label to be dynamic
        $content = $content -replace '(<label class="input-label" for="[^"]*input"[^>]*>)[^<]*(</label>)', '`$1 id="currency-label">USD ($)`$2'
        $content = $content -replace 'placeholder="Enter [^"]*"', 'placeholder="Enter amount"'
        
        # Add currency variables to JavaScript
        $currencyJS = @"
      // Currency conversion rates (to USD)
      const currencyRates = {
        USD: 1.0,
        GBP: 0.79, // 1 USD = 0.79 GBP
        EUR: 0.92, // 1 USD = 0.92 EUR
        CAD: 1.36, // 1 USD = 1.36 CAD
        AUD: 1.52, // 1 USD = 1.52 AUD
      };

      // Currency symbols
      const currencySymbols = {
        USD: "`$",
        GBP: "£",
        EUR: "€",
        CAD: "C`$",
        AUD: "A`$",
      };
"@
        
        # Add currency variables after existing rate constants
        $content = $content -replace '(\s+// Exchange rate.*?\n)', "`$1`n$currencyJS`n"
        
        # Add currentCurrency variable
        $content = $content -replace '(\s+let isUpdating = false;)', "`$1`n      let currentCurrency = `"USD`";"
        
        # Add currency selector to DOM elements
        $content = $content -replace '(\s+const quickBtns = document\.querySelectorAll\("\.quick-btn"\);)', "`$1`n      const currencySelect = document.getElementById(`"currency-select`");`n      const currencyLabel = document.getElementById(`"currency-label`");"
        
        # Add currency change event listener
        $content = $content -replace '(\s+clearBtn\.addEventListener\("click", clearInputs\);)', "`$1`n      currencySelect.addEventListener(`"change`", handleCurrencyChange);"
        
        # Update calculation functions to handle currency conversion
        # This is a simplified version - full implementation would need more specific patterns
        
        Set-Content $page $content
        Write-Host "Updated: $page"
    } else {
        Write-Host "File not found: $page"
    }
}

Write-Host "Currency selector addition completed!"
