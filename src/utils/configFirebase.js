const admin = require('firebase-admin');

const serviceAccount = require('./autoconta-12190-firebase-adminsdk-p8v1v-5adffb4fe4.json');

 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   storageBucket: 'gs://autoconta-12190.appspot.com'
 });

const bucket = admin.storage().bucket();

// Exporta el bucket para usarlo en otros archivos
module.exports = { bucket };