const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let serviceRunning = false; // Indique si le service est actif

// --- Routes ---
app.get('/', (req, res) => {
  res.send('AutoFluxCloud Ultra-Sécurisé est en ligne.');
});

// Vérification de token
function checkToken(req, res, next) {
  if (req.query.token !== process.env.TOKEN_SECRET) {
    return res.status(403).json({ status: "ERROR", message: "Invalid token" });
  }
  next();
}

// /ping
app.get('/ping', checkToken, (req, res) => {
  res.json({ status: "OK", message: "AutoFluxCloud Ultra-Sécurisé en ligne" });
});

// /start
app.get('/start', checkToken, (req, res) => {
  serviceRunning = true;
  res.json({ status: "OK", message: "Service started" });
});

// /stop
app.get('/stop', checkToken, (req, res) => {
  serviceRunning = false;
  res.json({ status: "OK", message: "Service stopped" });
});

// /status
app.get('/status', checkToken, (req, res) => {
  res.json({ status: "OK", running: serviceRunning });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`AutoFluxCloud Ultra-Sécurisé en ligne sur le port ${port}`);
});
