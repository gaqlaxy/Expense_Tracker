// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyC0d7Ak4r7-i43BOfNXLLG8Oby1CBQij28",
    authDomain: "expensetracker-4b0be.firebaseapp.com",
    projectId: "expensetracker-4b0be",
    storageBucket: "expensetracker-4b0be.firebasestorage.app",
    messagingSenderId: "728643354938",
    appId: "1:728643354938:web:0ad18a5d553179c7cc1003"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
