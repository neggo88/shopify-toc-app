require("dotenv").config();
const express = require("express");
const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");
// server.js & routes/auth.js
const { NodeRequest, NodeResponse } = require("@shopify/shopify-api/adapters/node");

const shopify = shopifyApi({
  // ... andere Einstellungen
  adapter: {
    request: NodeRequest,
    response: NodeResponse,
  },
});

const app = express();
const port = process.env.PORT || 10000;

// Shopify-Konfiguration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","),
  hostName: new URL(process.env.HOST).hostname,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  adapter: {
    request: NodeRequest,
    response: NodeResponse,
  },
});

// Middleware
app.use(express.json());
app.use(shopify.auth.buildHeaderMiddleware()); // WICHTIG für OAuth

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Health-Check-Endpunkt
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Server starten
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ App läuft auf Port ${port}`);
});