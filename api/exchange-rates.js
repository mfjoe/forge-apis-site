// Exchange Rates API - Serverless Function
// Fetches real-time exchange rates with fallback to static rates

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch real-time rates from exchangerate-api.com (free tier)
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        headers: {
          "User-Agent": "ForgeAPI-ExchangeRates/1.0",
        },
        timeout: 5000, // 5 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Extract only the currencies we need
    const rates = {
      USD: 1.0,
      GBP: data.rates.GBP || 0.78,
      EUR: data.rates.EUR || 0.85,
      CAD: data.rates.CAD || 1.35,
      AUD: data.rates.AUD || 1.48,
    };

    // Return the rates with metadata
    return res.status(200).json({
      success: true,
      base: "USD",
      rates: rates,
      lastUpdated: new Date().toISOString(),
      source: "exchangerate-api.com",
    });
  } catch (error) {
    console.error("Exchange rate API error:", error);

    // Fallback to static rates if API fails
    const fallbackRates = {
      USD: 1.0,
      GBP: 0.78, // 1 USD = 0.78 GBP
      EUR: 0.85, // 1 USD = 0.85 EUR
      CAD: 1.35, // 1 USD = 1.35 CAD
      AUD: 1.48, // 1 USD = 1.48 AUD
    };

    return res.status(200).json({
      success: false,
      base: "USD",
      rates: fallbackRates,
      lastUpdated: new Date().toISOString(),
      source: "fallback-static-rates",
      error: "Using fallback rates due to API error",
    });
  }
}
