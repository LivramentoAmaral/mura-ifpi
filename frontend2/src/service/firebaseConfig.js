// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDsvqY5MuiXkCvvGuuGxNDvk7uSA8s_TXY",
    authDomain: "mural-ifpi.firebaseapp.com",
    projectId: "mural-ifpi",
    storageBucket: "mural-ifpi.firebasestorage.app",
    messagingSenderId: "379753211388",
    appId: "1:379753211388:web:6f4196b57ca7380778be79",
    measurementId: "G-PG7FZDT6V3"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
