require("dotenv").config();
const express = require("express");
const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");
const { NodeAdapter } = require("@shopify/shopify-api/adapters/node"); // Shopify-Adapter explizit setzen

const app = express();
app.set("trust proxy", 1); // Render Proxy aktivieren

const port = process.env.PORT || 10000;

// Shopify API-Konfiguration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","),
  hostName: new URL(process.env.HOST).hostname,
  apiVersion: "2024-01", // Feste API-Version nutzen
  isEmbeddedApp: true,
  adapter: NodeAdapter, // WICHTIG: Adapter setzen!
});

app.use(express.json());

// Auth-Route für Shopify
app.get("/auth", async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin({
      shop: req.query.shop,
      callbackPath: "/auth/callback",
      isOnline: false,
    });
    res.redirect(authRoute);
  } catch (error) {
    console.error("Fehler bei der Authentifizierung:", error);
    res.status(500).send("Fehler bei der Installation");
  }
});

// Auth-Callback-Route (wichtig für Shopify-Login!)
app.get("/auth/callback", async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect(`/?shop=${req.query.shop}`);
  } catch (error) {
    console.error("Fehler beim Auth-Callback:", error);
    res.status(500).send("Callback-Fehler");
  }
});

// Health-Check (optional für Render Monitoring)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Server starten
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ App läuft auf Port ${port}`);
});
