// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfggLE-VKuaHVandmtQjtf_HPcP4bmpIc",
  authDomain: "parada-boa.firebaseapp.com",
  projectId: "parada-boa",
  storageBucket: "parada-boa.firebasestorage.app",
  messagingSenderId: "824921482345",
  appId: "1:824921482345:web:d006634e5adeb2e579eef8",
  measurementId: "G-0FF5GC47J6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
