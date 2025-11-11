import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCm5YCv-gdMEU45wKsnnCVrkR23xJiuny0",
    authDomain: "lapshop-32a2f.firebaseapp.com",
    projectId: "lapshop-32a2f",
    storageBucket: "lapshop-32a2f.firebasestorage.app",
    messagingSenderId: "715989351539",
    appId: "1:715989351539:web:e00686b8062ac2d1017e06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)