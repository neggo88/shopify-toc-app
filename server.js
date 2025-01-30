require('dotenv').config();
const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { NodeWebSocket } = require('@shopify/shopify-api/adapters/node');

const app = express();
const port = process.env.PORT || 3000; // Render setzt PORT automatisch

// Shopify-Konfiguration
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: new URL(process.env.HOST).hostname, // Korrigiert den Hostnamen
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  runtime: NodeWebSocket, // Adapter für Node.js
});

app.use(express.json());

// Health-Check-Endpunkt (für Render Monitoring)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Starte Server
app.listen(port, '0.0.0.0', () => { // Höre auf allen Netzwerkschnittstellen
  console.log(`App läuft auf Port ${port}`);
});

// Importiere die auth-Route
const authRoutes = require('./routes/auth');

// Verwende die auth-Route
app.use('/auth', authRoutes);