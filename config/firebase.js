// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQxC-w6K04hNuKlcoPmgjyMQi8nwpLWWs",
  authDomain: "mobile-hafiz.firebaseapp.com",
  databaseURL: "https://mobile-hafiz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobile-hafiz",
  storageBucket: "mobile-hafiz.appspot.com",
  messagingSenderId: "345912451693",
  appId: "1:345912451693:web:4fed208502044f57771564",
  measurementId: "G-T5L6S6P2VV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export { firebaseApp, database };