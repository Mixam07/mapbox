import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

const API_KEY = "AIzaSyDcdl-7jROMuCSze6ANikjJUoMRBDglBzs";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "mapbox-8444d.firebaseapp.com",
  projectId: "mapbox-8444d",
  storageBucket: "mapbox-8444d.appspot.com",
  messagingSenderId: "446181864743",
  appId: "1:446181864743:web:00585a175eec5346e3a502",
  measurementId: "G-JHN1MNZC4V"
};

export const app = initializeApp(firebaseConfig);
export const googleAuthProvider = new GoogleAuthProvider();