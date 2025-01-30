const express = require('express');
const router = express.Router();
const { shopify } = require('../shopify.config');

router.get('/', async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin({
      shop: req.query.shop,
      callbackPath: '/auth/callback',
      isOnline: false
    });
    res.redirect(authRoute);
  } catch (error) {
    res.status(500).send('Fehler bei der Installation');
  }
});

router.get('/callback', async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect('/?shop=${req.query.shop}');
  } catch (error) {
    res.status(500).send('Installation fehlgeschlagen');
  }
});

module.exports = router;