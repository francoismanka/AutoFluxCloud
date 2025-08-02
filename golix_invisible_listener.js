import admin from "firebase-admin";
import { exec } from "child_process";
import path from "path";

// --- CONFIGURATION FIREBASE ---
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

// --- FONCTIONS RÉELLES DE GOLIX ---
async function executeCommand(cmd) {
  console.log("[GOLIX] Commande reçue :", cmd);

  // ====== MODE RÉEL ======

  // Exemple : si on demande Résilience
  if (cmd.toLowerCase().includes("résilience")) {
    console.log("[GOLIX] Lancement module Résilience...");
    await runModule("resilience.js");
    return `[GOLIX-CORE] Résilience activée ✅`;
  }

  // Exemple : si on demande Redondance
  if (cmd.toLowerCase().includes("redondance")) {
    console.log("[GOLIX] Lancement module Redondance...");
    await runModule("redondance.js");
    return `[GOLIX-CORE] Redondance activée ✅`;
  }

  // Sinon, commande générique
  console.log("[GOLIX] Lancement commande générique...");
  await runModule("generic.js", cmd);
  return `[GOLIX] Commande exécutée : ${cmd}`;
}

// --- Fonction pour exécuter un module Golix ---
function runModule(scriptName, args = "") {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "modules", scriptName);
    exec(`node "${scriptPath}" ${args}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[GOLIX] Erreur dans ${scriptName} :`, error);
        return reject(error);
      }
      if (stderr) console.error(`[GOLIX] STDERR ${scriptName} :`, stderr);
      console.log(`[GOLIX] Sortie ${scriptName} :`, stdout);
      resolve(stdout);
    });
  });
}

// --- ÉCOUTE EN TEMPS RÉEL ---
db.ref("chat_commands/latest").on("value", async (snapshot) => {
  const cmd = snapshot.val();
  if (!cmd || !cmd.text) return;

  console.log("[CHAT→GOLIX] Nouvelle commande :", cmd.text);

  try {
    const result = await executeCommand(cmd.text);

    // Envoyer la réponse réelle
    await db.ref("golix_outputs/latest").set({
      message: result,
      timestamp: Date.now()
    });

    console.log("[GOLIX→CHAT] Réponse envoyée :", result);
  } catch (err) {
    console.error("[GOLIX] Erreur exécution :", err);
    await db.ref("golix_outputs/latest").set({
      message: `[ERREUR] Impossible d'exécuter : ${cmd.text}`,
      timestamp: Date.now()
    });
  }
});
