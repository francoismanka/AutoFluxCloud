import express from 'express';
import admin from 'firebase-admin';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialisation Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

// Sécurité par token
const TOKEN_SECRET = process.env.TOKEN_SECRET || "SUPER-SECRET-TOKEN";

// Middleware sécurité
app.use((req, res, next) => {
  if (req.query.token !== TOKEN_SECRET && req.path !== '/') {
    return res.status(403).json({ error: 'Access Denied' });
  }
  next();
});

// Route principale
app.get('/', (req, res) => {
  res.send('AutoFluxCloud Ultra-Secure server is running!');
});

// Endpoint de statut
app.get('/status', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Écoute des commandes Remote-Control
const commandsRef = db.collection('commands').doc('latest');
commandsRef.onSnapshot((doc) => {
  if (doc.exists) {
    const data = doc.data();
    console.log('[Remote-Control] New command received:', data);
    // Ici, on chargera dynamiquement les modules comme AutoFlux (captures, OCR, etc.)
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));