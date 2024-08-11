// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBjH0fllj39aNxZhiUQxlElWmUDOGmt5LE",
    authDomain: "snaplens-79ab3.firebaseapp.com",
    projectId: "snaplens-79ab3",
    storageBucket: "snaplens-79ab3.appspot.com",
    messagingSenderId: "5142271824",
    appId: "1:5142271824:web:d33a82c027302920ef3e55",
    measurementId: "G-645JNLSK4J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);