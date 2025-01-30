const express = require('express');
const router = express.Router();
const { generateTOC } = require('../utils/tocHelper');

router.post('/article-update', async (req, res) => {
  try {
    const { body_html, id } = req.body;
    const { modifiedContent, tocHtml } = generateTOC(body_html);
    
    // Hier würdest du die Shopify API aufrufen um den Artikel zu aktualisieren
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Fehler beim Generieren des TOC');
  }
});

module.exports = router;