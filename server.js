const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let serviceRunning = false;
let lastAnalysis = "Aucune analyse en cours.";

// Vérification de token
function checkToken(req, res, next) {
  if (req.query.token !== process.env.TOKEN_SECRET) {
    return res.status(403).json({ status: "ERROR", message: "Invalid token" });
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  res.send('AutoFluxCloud Ultra-Sécurisé est en ligne.');
});

app.get('/ping', checkToken, (req, res) => {
  res.json({ status: "OK", message: "AutoFluxCloud Ultra-Sécurisé en ligne" });
});

app.get('/start', checkToken, (req, res) => {
  serviceRunning = true;
  lastAnalysis = "Analyse démarrée.";
  res.json({ status: "OK", message: "Service démarré" });
});

app.get('/stop', checkToken, (req, res) => {
  serviceRunning = false;
  lastAnalysis = "Analyse arrêtée.";
  res.json({ status: "OK", message: "Service stoppé" });
});

app.get('/status', checkToken, (req, res) => {
  res.json({ status: "OK", running: serviceRunning });
});

app.get('/analysis', checkToken, (req, res) => {
  res.json({ status: "OK", message: lastAnalysis });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`AutoFluxCloud Ultra-Sécurisé en ligne sur le port ${port}`);
});
