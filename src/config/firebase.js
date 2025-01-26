import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPdCTrqDcpuvhGlNiDaijEZWUNVA0Jmno",
  authDomain: "carcare-ff31c.firebaseapp.com",
  databaseURL: "https://carcare-ff31c-default-rtdb.firebaseio.com",
  projectId: "carcare-ff31c",
  storageBucket: "carcare-ff31c.appspot.com",
  messagingSenderId: "477799501916",
  appId: "1:477799501916:web:c19059cbf59c35cf805699",
  measurementId: "G-DPT1Y3EL84"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);