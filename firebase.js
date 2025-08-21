// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeauigYlSxKIA8A9df-8IZR6jhFuB4CI4",
  authDomain: "lamondcivitano.firebaseapp.com",
  projectId: "lamondcivitano",
  storageBucket: "lamondcivitano.firebasestorage.app",
  messagingSenderId: "574645937369",
  appId: "1:574645937369:web:754b3422ad5a23eb77cac8",
  measurementId: "G-Q69BFLG1VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
