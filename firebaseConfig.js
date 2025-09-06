import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLvILCpXiMtnwEv1Y0aDdVcaRWn7kT9b0",
  authDomain: "fndt-5d86a.firebaseapp.com",
  projectId: "fndt-5d86a",
  storageBucket: "fndt-5d86a.appspot.com",
  messagingSenderId: "168448967790",
  appId: "1:168448967790:web:015b972b020038d603527f",
  measurementId: "G-0TC0QPV0YR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 