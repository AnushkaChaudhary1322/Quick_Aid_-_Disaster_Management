// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAONSF6Z0agGxBo9jtLjfr7rjjiRPX9yJU",
  authDomain: "mern-blog-3ec1b.firebaseapp.com",
  projectId: "mern-blog-3ec1b",
  storageBucket: "mern-blog-3ec1b.appspot.com",
  messagingSenderId: "930030021234",
  appId: "1:930030021234:web:8cfe9883cb14ef667d70eb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);