// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyAb_z_j2FiPvg7M6mQdrVGoB2c7C-5C5qY',
  authDomain: 'adnan-mahmood.firebaseapp.com',
  databaseURL: 'https://adnan-mahmood-default-rtdb.firebaseio.com',
  projectId: 'adnan-mahmood',
  storageBucket: 'adnan-mahmood.firebasestorage.app',
  messagingSenderId: '188698910798',
  appId: '1:188698910798:web:2fc05ecc69ba5405f1e31f',
  measurementId: 'G-MQ99Q5BF75',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const fireBaseDatabase = getDatabase(app);
// export const analytics = getAnalytics(app);

export const fireStoreDB = getFirestore(app);
