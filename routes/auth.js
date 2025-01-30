const express = require('express');
const router = express.Router();
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { NodeWebSocket } = require('@shopify/shopify-api/adapters/node');

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: new URL(process.env.HOST).hostname,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  runtime: NodeWebSocket,
});

// Installationsroute
router.get('/', async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin({
      shop: req.query.shop,
      callbackPath: '/auth/callback',
      isOnline: false,
    });
    res.redirect(authRoute);
  } catch (error) {
    res.status(500).send('Fehler bei der Installation');
  }
});

// Callback-Route
router.get('/callback', async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Installation fehlgeschlagen');
  }
});

module.exports = router;