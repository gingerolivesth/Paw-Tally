import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ======================================================================
// 1) PASTE YOUR FIREBASE CONFIG HERE (from Firebase console > Project
//    settings > General > Your apps > SDK setup and configuration).
//    See README.md for the full walkthrough.
// ======================================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAwr2gxcnAnsf6Jss_-anoVFMUnzD6R3_k",
  authDomain: "ginger-olives-calculator.firebaseapp.com",
  projectId: "ginger-olives-calculator",
  storageBucket: "ginger-olives-calculator.firebasestorage.app",
  messagingSenderId: "918470366561",
  appId: "1:918470366561:web:84c439085e9b7108a46120",
  measurementId: "G-FYVDC0XKL1"
};

export const isConfigured = FIREBASE_CONFIG.apiKey !== "PASTE_ME";

let app = null;
let db = null;
let entriesCol = null;

if (isConfigured) {
  app = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(app);
  entriesCol = collection(db, "payments");
}

export { app, db, entriesCol };