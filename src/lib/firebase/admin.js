const admin = require('firebase-admin');
const databaseURL = process.env.FIREBASE_DB;
require('dotenv').config();
const firebaseServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    databaseURL,
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}

module.exports = admin;
