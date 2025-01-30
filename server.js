require('dotenv').config();
const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { NodeWebSocket } = require('@shopify/shopify-api/adapters/node'); // WICHTIG: Adapter hinzufügen

const app = express();
const port = 3000;

// Shopify-Konfiguration MIT ADAPTER
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST.replace(/https:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  runtime: NodeWebSocket, // Adapter für Node.js
});

app.use(express.json());

// ... Rest des Codes bleibt gleich