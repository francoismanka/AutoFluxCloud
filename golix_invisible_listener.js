import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

async function executeCommand(cmd) {
  console.log("[GOLIX] Exécution réelle :", cmd);

  if (cmd.toLowerCase().includes("résilience")) {
    return `[GOLIX-CORE] Optimisation résilience → duplication des nœuds critiques.`;
  }
  if (cmd.toLowerCase().includes("redondance")) {
    return `[GOLIX-CORE] Renforcement redondance → réplication multi-niveaux activée.`;
  }

  return `[GOLIX] Commande exécutée : ${cmd}`;
}

db.ref("chat_commands/latest").on("value", async (snapshot) => {
  const cmd = snapshot.val();
  if (!cmd || !cmd.text) return;

  console.log("[CHAT→GOLIX] Commande détectée :", cmd.text);

  const result = await executeCommand(cmd.text);

  await db.ref("golix_outputs/latest").set({
    message: result,
    timestamp: Date.now()
  });

  console.log("[GOLIX→CHAT] Réponse envoyée :", result);
});
