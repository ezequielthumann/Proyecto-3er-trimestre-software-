// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxGuhGiKMFX9kO2mMIF0ilCVEu0ezvb28",
  authDomain: "redsocial-52539.firebaseapp.com",
  projectId: "redsocial-52539",
  storageBucket: "redsocial-52539.appspot.com",
  messagingSenderId: "47550864334",
  appId: "1:47550864334:web:1e228f2290fd895b1f299f",
  measurementId: "G-74K8JK888F"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
