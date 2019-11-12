import firebase from 'firebase';
require('firebase/firestore');

const fb = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notes-5211e.firebaseapp.com",
  databaseURL: "https://notes-5211e.firebaseio.com",
  projectId: "notes-5211e",
  storageBucket: "",
  messagingSenderId: "399043506173",
  appId: "1:399043506173:web:41f8346d4bc3c5e0"
});

const firestore = fb.firestore();

export { firestore };