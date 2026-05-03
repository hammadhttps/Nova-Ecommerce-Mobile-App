// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVb0lcokEaDJ3oq53VasYUg2IX4A_oBDA",
  authDomain: "nova-b980c.firebaseapp.com",
  projectId: "nova-b980c",
  storageBucket: "nova-b980c.firebasestorage.app",
  messagingSenderId: "220110823698",
  appId: "1:220110823698:web:776c0c5c00c7d9109f13cb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
