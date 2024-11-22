// import admin from 'firebase-admin';

// const serviceAccount = require('./path-to-service-account.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
// });

// const admin = require('firebase-admin');
// import admin from 'firebase-admin';

const admin = require('firebase-admin');

const serviceAccount = require('../adnan-mahmood-firebase-adminsdk-btnxm-52dbdfcbb3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
});

// export const firebaseDB = admin.database();

// export const requestsRef = firebaseDB.ref('requests');

export const firestoreDB = admin.firestore();
