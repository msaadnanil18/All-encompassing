import admin from 'firebase-admin';

import serviceAccount from './adnan-mahmood-firebase-adminsdk-btnxm-52dbdfcbb3.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
});

export const firestoreDB = admin.firestore();

firestoreDB.settings({
  ignoreUndefinedProperties: true,
});
