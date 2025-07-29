const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('AutoFluxCloud Ultra-Sécurisé est en ligne.');
});

app.get('/ping', (req, res) => {
  if (req.query.token !== process.env.TOKEN_SECRET) {
    return res.status(403).json({ status: "ERROR", message: "Invalid token" });
  }
  res.json({ status: "OK", message: "AutoFluxCloud Ultra-Sécurisé en ligne" });
});

app.listen(port, () => {
  console.log(`AutoFluxCloud Ultra-Sécurisé en ligne sur le port ${port}`);
});
