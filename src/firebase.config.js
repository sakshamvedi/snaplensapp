// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCp8p5pvL07qplRmBVMv-GiDj55ZsrtVlo",
    authDomain: "snaplens-48f4e.firebaseapp.com",
    projectId: "snaplens-48f4e",
    storageBucket: "snaplens-48f4e.appspot.com",
    messagingSenderId: "464755293884",
    appId: "1:464755293884:web:00c72ef62553e87b60dab9",
    measurementId: "G-GHTPDYD90S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);