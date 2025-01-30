const express = require("express");
const router = express.Router();
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

// Shopify-Konfiguration (muss mit server.js identisch sein)
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

// Installationsroute
router.get("/", async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin({
      shop: req.query.shop,
      callbackPath: "/auth/callback",
      isOnline: false,
      rawRequest: NodeRequest(req), // WICHTIG
      rawResponse: NodeResponse(res) // WICHTIG
    });
    res.redirect(authRoute);
  } catch (error) {
    console.error("🔥 Fehler:", error);
    res.status(500).send("Installation fehlgeschlagen");
  }
});
    res.redirect(authRoute);
  } catch (error) {
    console.error("🔥 Fehler bei der Installation:", error);
    res.status(500).send(`
      <h1>Installation fehlgeschlagen</h1>
      <p>${error.message}</p>
    `);
  }
});

// Callback-Route
router.get("/callback", async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback({
      rawRequest: NodeRequest(req),
      rawResponse: NodeResponse(res),
    });

    res.redirect("/?shop=" + req.query.shop);
  } catch (error) {
    console.error("🔥 Fehler im Callback:", error);
    res.status(500).send(`
      <h1>Callback fehlgeschlagen</h1>
      <p>${error.message}</p>
    `);
  }
});

module.exports = router;