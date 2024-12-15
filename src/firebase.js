// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4uthUCcIlBRFPkvQVWB3fI6EFbRDzebI",
  authDomain: "studying-with-the-wall.firebaseapp.com",
  projectId: "studying-with-the-wall",
  storageBucket: "studying-with-the-wall.firebasestorage.app",
  messagingSenderId: "698437784543",
  appId: "1:698437784543:web:5c574d1260fde213aa2a6a",
  measurementId: "G-DPV1YNQ5T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 初期化
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {auth, provider, db};