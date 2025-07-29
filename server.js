const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Vérification Token ---
function checkToken(req, res, next) {
  const token = req.query.token || req.headers['x-access-token'];
  if (!token || token !== process.env.TOKEN_SECRET) {
    return res.status(403).json({ status: "ERROR", message: "Invalid or missing token" });
  }
  next();
}

// --- Firebase Init ---
try {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase initialized");
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

// --- Routes ---
let autoFluxActive = false;
let lastStartTime = null;

app.get('/ping', checkToken, (req, res) => {
  res.json({ status: "OK", message: "AutoFluxCloud Ultra-Sécurisé en ligne" });
});

app.post('/start', checkToken, (req, res) => {
  autoFluxActive = true;
  lastStartTime = new Date();
  console.log("AutoFlux START");
  res.json({ status: "OK", message: "AutoFlux démarré" });
});

app.post('/stop', checkToken, (req, res) => {
  autoFluxActive = false;
  console.log("AutoFlux STOP");
  res.json({ status: "OK", message: "AutoFlux arrêté" });
});

app.get('/status', checkToken, (req,
