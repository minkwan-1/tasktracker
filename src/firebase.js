import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "task-tracker3.firebaseapp.com",
  projectId: "task-tracker3",
  storageBucket: "task-tracker3.appspot.com",
  messagingSenderId: "977756658453",
  appId: "1:977756658453:web:588402c61ac23db27c671c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

export { auth, db, storage, onAuthStateChanged };
