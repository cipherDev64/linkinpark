import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZnve1I2J7brWB1789LI8s6D4NSg13n1A",
  authDomain: "linkinpark-46ac8.firebaseapp.com",
  projectId: "linkinpark-46ac8",
  storageBucket: "linkinpark-46ac8.firebasestorage.app",
  messagingSenderId: "249617716376",
  appId: "1:249617716376:web:432f0948fc0d1541d4aced"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
