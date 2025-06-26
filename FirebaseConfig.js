// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy2CZKFQou_j3OrWETHaBNCWSEAfsdVYE",
  authDomain: "dict-tech4ed.firebaseapp.com",
  databaseURL: "https://dict-tech4ed-default-rtdb.firebaseio.com",
  projectId: "dict-tech4ed",
  storageBucket: "dict-tech4ed.firebasestorage.app",
  messagingSenderId: "550733297039",
  appId: "1:550733297039:web:8b169256313e9f890e47fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };