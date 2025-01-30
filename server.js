require("dotenv").config();
const express = require("express");
const { shopifyApi } = require("@shopify/shopify-api");

const app = express();
app.set("trust proxy", 1); // Shopify-Requests über Render-Proxy erlauben

const port = process.env.PORT || 10000;

// Shopify-Konfiguration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","),
  hostName: new URL(process.env.HOST).hostname,
  apiVersion: "2024-01", // Nutze eine feste API-Version
  isEmbeddedApp: true,
});

app.use(express.json());

// 🔹 Shopify-Auth-Route direkt in `server.js` hinzufügen
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

// 🔹 Auth Callback (wichtig für Shopify-Login!)
app.get("/auth/callback", async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect(`/?shop=${req.query.shop}`);
  } catch (error) {
    console.error("Fehler beim Auth-Callback:", error);
    res.status(500).send("Callback-Fehler");
  }
});

// 🔹 Health-Check (wichtig für Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Server starten
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ App läuft auf Port ${port}`);
});
