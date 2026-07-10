import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnS4Oyp4Ntycqiq7nQRyiZIqVO21SXZrY",
  authDomain: "telisi.firebaseapp.com",
  projectId: "telisi",
  storageBucket: "telisi.firebasestorage.app",
  messagingSenderId: "286285003684",
  appId: "1:286285003684:web:cd16f6a9b86a20e5765f31",
  measurementId: "G-WJB2XJV2RM"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };