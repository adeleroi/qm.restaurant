import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD2TDYO33S8cp2QZeJCbFbtFfYX78hYu_w",
  authDomain: "cryptowebsite-798af.firebaseapp.com",
  databaseURL: "https://cryptowebsite-798af.firebaseio.com",
  projectId: "cryptowebsite-798af",
  storageBucket: "cryptowebsite-798af.appspot.com",
  messagingSenderId: "539986089152",
  appId: "1:539986089152:web:3209e9fa103eb027420925",
  measurementId: "G-XF5QW4EN4E"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);
