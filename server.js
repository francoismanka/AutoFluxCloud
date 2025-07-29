const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Vérification token
function checkToken(req, res, next) {
  const token = req.query.token || req.headers['x-access-token'];
  if (!token || token !== process.env.TOKEN_SECRET) {
    return res.status(403).json({ status: "ERROR", message: "Invalid or missing token" });
  }
  next();
}

// Init Firebase
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

// Routes
app.get('/ping', checkToken, (req, res) => {
  res.json({ status: "OK", message: "AutoFluxCloud Ultra-Sécurisé en ligne" });
});

app.get('/', (req, res) => {
  res.send("AutoFluxCloud Ultra-Sécurisé est en ligne.");
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`AutoFluxCloud Ultra-Sécurisé démarré sur le port ${port}`);
});
