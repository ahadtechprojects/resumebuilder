// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBhath_H1upZ9zmkmZJeA8Zn4VgON0yWSk",
  authDomain: "resume-56743.firebaseapp.com",
  projectId: "resume-56743",
  storageBucket: "resume-56743.firebasestorage.app",
  messagingSenderId: "717495210431",
  appId: "1:717495210431:web:6e24f113a9e8e37120d10a",
  measurementId: "G-0Y7RVGZQYV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
