// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgKqbap65oHTbIqwsAN7NYfZLZS8RS6hE",
  authDomain: "note-4d4ac.firebaseapp.com",
  projectId: "note-4d4ac",
  storageBucket: "note-4d4ac.firebasestorage.app",
  messagingSenderId: "936536926127",
  appId: "1:936536926127:web:7a000fbae24b8aeb56715a",
  measurementId: "G-C3P8NEMF6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 初期化
const auth = getAuth(app);
console.log(auth);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {auth, provider, db};