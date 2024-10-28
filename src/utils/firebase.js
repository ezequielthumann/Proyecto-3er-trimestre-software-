// Importa las funciones que necesitas de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxGuhGiKMFX9kO2mMIF0ilCVEu0ezvb28",
  authDomain: "redsocial-52539.firebaseapp.com",
  projectId: "redsocial-52539",
  storageBucket: "redsocial-52539.appspot.com",
  messagingSenderId: "47550864334",
  appId: "1:47550864334:web:1e228f2290fd895b1f299f",
  measurementId: "G-74K8JK888F"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Función para registrar usuario
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuario registrado:', userCredential.user);
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
  }
};

// Función para iniciar sesión
import firebase from 'firebase/app'
import 'firebase/auth'

export const loginUser = async (email, password) => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}


// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Usuario cerró sesión');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

// Función para guardar datos de usuario
export const saveUserData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'usuarios'), data);
    console.log('Documento escrito con ID:', docRef.id);
  } catch (error) {
    console.error('Error al agregar documento:', error.message);
  }
};
