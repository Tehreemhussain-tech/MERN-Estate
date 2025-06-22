// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5d3d8.firebaseapp.com",
  projectId: "mern-estate-5d3d8",
  storageBucket: "mern-estate-5d3d8.firebasestorage.app",
  messagingSenderId: "513637086318",
  appId: "1:513637086318:web:920eb525be6a72e1d5e27f",
  measurementId: "G-V3GPKMRJCX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);