// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider ,FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXogRTbAzpvkMAdhNbqd2HaUvBnVXwDII",
  authDomain: "meetup-app-50bbf.firebaseapp.com",
  databaseURL: "https://meetup-app-50bbf-default-rtdb.firebaseio.com",
  projectId: "meetup-app-50bbf",
  storageBucket: "meetup-app-50bbf.appspot.com",
  messagingSenderId: "639871557564",
  appId: "1:639871557564:web:9043e1c7237ce0057555b9",
  measurementId: "G-YVJ7T8KNMP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();

export { app, auth, googleAuthProvider , facebookAuthProvider, getDatabase, ref, push, onValue, off };
