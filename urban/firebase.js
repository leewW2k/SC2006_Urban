// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKSJpXeN6Z5KpUiw5qm3IkF59hIJOt4As",
  authDomain: "urban-6c252.firebaseapp.com",
  projectId: "urban-6c252",
  storageBucket: "urban-6c252.appspot.com",
  messagingSenderId: "662282139152",
  appId: "1:662282139152:web:6b4293b1795bd60fe13c95",
  measurementId: "G-S3LZV835HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();