const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = process.argv[2];
if (!email) {
  console.error("Please provide a user email");
  process.exit(1);
}

async function setAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ User ${email} has been set as admin`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting admin:", error);
    process.exit(1);
  }
}

setAdmin();
