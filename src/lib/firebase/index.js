const admin =  require('./admin');

const db = admin.firestore();

const auth = admin.auth();


module.exports = { auth, db };
