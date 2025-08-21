/**
 * Secure Cookie Consent Management
 * Replace localStorage with secure cookie handling
 */

(function() {
    'use strict';

    // Cookie utilities
    const CookieManager = {
        set: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "; expires=" + date.toUTCString();
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            // SameSite=Strict prevents CSRF attacks
            document.cookie = name + "=" + value + expires + "; path=/; SameSite=Strict" + secure;
        },

        get: function(name) {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            for(let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length);
                }
            }
            return null;
        },

        delete: function(name) {
            this.set(name, "", -1);
        }
    };

    // Consent management
    const ConsentManager = {
        CONSENT_COOKIE: 'forge_cookie_consent',
        CONSENT_DATE_COOKIE: 'forge_consent_date',
        GA_LOADED: false,

        init: function() {
            // Check existing consent
            const consent = CookieManager.get(this.CONSENT_COOKIE);
            
            if (!consent) {
                this.showBanner();
            } else if (consent === 'accepted') {
                this.loadGoogleAnalytics();
            }
            
            // Bind button handlers
            this.bindHandlers();
        },

        bindHandlers: function() {
            // Accept button
            const acceptBtn = document.getElementById('cookie-accept-btn');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => this.acceptCookies());
            }

            // Reject button
            const rejectBtn = document.getElementById('cookie-reject-btn');
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => this.rejectCookies());
            }

            // Settings button (if you add one)
            const settingsBtn = document.getElementById('cookie-settings-btn');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => this.showSettings());
            }
        },

        showBanner: function() {
            const banner = document.getElementById('cookieConsent');
            if (banner) {
                banner.style.display = 'block';
                // Announce to screen readers
                banner.setAttribute('role', 'alert');
                banner.setAttribute('aria-live', 'polite');
            }
        },

        hideBanner: function() {
            const banner = document.getElementById('cookieConsent');
            if (banner) {
                // Fade out animation
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            }
        },

        acceptCookies: function() {
            // Set secure cookies
            CookieManager.set(this.CONSENT_COOKIE, 'accepted', 365);
            CookieManager.set(this.CONSENT_DATE_COOKIE, new Date().toISOString(), 365);
            
            // Hide banner
            this.hideBanner();
            
            // Load analytics
            this.loadGoogleAnalytics();
            
            // Log for compliance
            this.logConsent('accepted');
        },

        rejectCookies: function() {
            // Set minimal cookie (ironically needed to remember rejection)
            CookieManager.set(this.CONSENT_COOKIE, 'rejected', 365);
            CookieManager.set(this.CONSENT_DATE_COOKIE, new Date().toISOString(), 365);
            
            // Hide banner
            this.hideBanner();
            
            // Ensure no tracking scripts load
            this.blockTracking();
            
            // Log for compliance
            this.logConsent('rejected');
        },

        showSettings: function() {
            // Implement granular cookie settings UI
            console.log('Cookie settings - to be implemented');
        },

        loadGoogleAnalytics: function() {
            if (this.GA_LOADED) return;
            
            // Only load GA if truly consented
            if (CookieManager.get(this.CONSENT_COOKIE) !== 'accepted') return;
            
            // Your GA code here (example)
            console.log('Loading Google Analytics...');
            
            // Uncomment and add your GA ID when ready:
            /*
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
                'anonymize_ip': true,  // GDPR compliance
                'cookie_flags': 'SameSite=Strict;Secure'
            });
            */
            
            this.GA_LOADED = true;
        },

        blockTracking: function() {
            // Prevent any tracking scripts from loading
            // Remove any existing GA cookies
            const gaCookies = ['_ga', '_gid', '_gat', '__utma', '__utmb', '__utmc', '__utmz'];
            gaCookies.forEach(cookie => CookieManager.delete(cookie));
        },

        logConsent: function(decision) {
            // Log consent decision for GDPR compliance
            // In production, you might want to send this to your server
            console.log(`Cookie consent: ${decision} at ${new Date().toISOString()}`);
            
            // Could POST to your API:
            /*
            fetch('/api/log-consent', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    decision: decision,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                })
            });
            */
        },

        // Check if consent is older than 365 days (re-consent requirement)
        checkConsentAge: function() {
            const consentDate = CookieManager.get(this.CONSENT_DATE_COOKIE);
            if (consentDate) {
                const daysSinceConsent = (Date.now() - new Date(consentDate)) / (1000 * 60 * 60 * 24);
                if (daysSinceConsent > 365) {
                    // Reset consent after a year
                    CookieManager.delete(this.CONSENT_COOKIE);
                    CookieManager.delete(this.CONSENT_DATE_COOKIE);
                    this.showBanner();
                }
            }
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ConsentManager.init());
    } else {
        ConsentManager.init();
    }

    // Export for testing if needed
    window.ForgeConsentManager = ConsentManager;

})();