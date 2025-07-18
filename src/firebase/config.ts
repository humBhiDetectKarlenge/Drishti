import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDOBpVEPavgvjYGG_eBvkC2Dm_pJtBeVHk",
    authDomain: "hum-bhi-detect-karlenge.firebaseapp.com",
    databaseURL: "https://hum-bhi-detect-karlenge-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hum-bhi-detect-karlenge",
    storageBucket: "hum-bhi-detect-karlenge.firebasestorage.app",
    messagingSenderId: "863231913183",
    appId: "1:863231913183:web:f3cda0a8a5c28bf21a0d6a",
    measurementId: "G-QJSV8CE4TY"
  };

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
