// import admin from 'firebase-admin';

// const serviceAccount = require('./path-to-service-account.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
// });

// const admin = require('firebase-admin');
import admin from 'firebase-admin';
// export const firebaseDB = admin.database();

// export const requestsRef = firebaseDB.ref('requests');

// const admin = require('firebase-admin');

import serviceAccount from '../adnan-mahmood-firebase-adminsdk-btnxm-52dbdfcbb3.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
});

export const firestoreDB = admin.firestore();

const sendToFirebase = async (data: any) => {
  const db = admin.firestore();
  await db.collection(data.schemaType).add(data);
};
