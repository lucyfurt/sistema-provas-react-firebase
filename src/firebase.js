// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBmf1T7T9bF7yX5bGW2iogfzDrOFyVv88U",
  authDomain: "sistema-de-avaliacao-a90c8.firebaseapp.com",
  projectId: "sistema-de-avaliacao-a90c8",
  storageBucket: "sistema-de-avaliacao-a90c8.firebasestorage.app",
  messagingSenderId: "270757295487",
  appId: "1:270757295487:web:9c203d4ef90644dc85964a"
};
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços de autenticação e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };