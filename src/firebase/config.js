import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbWXXVB0rbqPIHuKrvclaKELfZQacziIQ",
  authDomain: "folkify-f8086.firebaseapp.com",
  projectId: "folkify-f8086",
  storageBucket: "folkify-f8086.firebasestorage.app",
  messagingSenderId: "791280020700",
  appId: "1:791280020700:web:829e5e506f2f9564c1d819",
  measurementId: "G-36GWS5M51C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
