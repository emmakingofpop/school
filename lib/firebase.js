// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClwjgakSC9bJddhl0uwsT_XfTtwSNM6_I",
  authDomain: "school-7ec02.firebaseapp.com",
  projectId: "school-7ec02",
  storageBucket: "school-7ec02.firebasestorage.app",
  messagingSenderId: "757487475645",
  appId: "1:757487475645:web:ef508b988038c05b7f10d4",
  measurementId: "G-8F77E6SEK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db,app,auth };