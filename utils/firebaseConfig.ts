import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_FIREBASE_PROJECTID,
    storageBucket: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_FIREBASE_SENDER_ID,
    appId: process.env.EXPO_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app)
