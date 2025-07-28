import express from 'express';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase Admin initialization
const serviceAccount = JSON.parse(await readFile('./firebaseServiceAccount.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

app.get('/', (req, res) => {
  res.send('AutoFluxCloud server is running!');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));