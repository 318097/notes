import firebase from 'firebase';
require('firebase/firestore');

const fb = firebase.initializeApp({
  apiKey: "AIzaSyBTfH9en075CKmOwoJuJbTCyqBforggU7g",
  authDomain: "notes-5211e.firebaseapp.com",
  databaseURL: "https://notes-5211e.firebaseio.com",
  projectId: "notes-5211e",
  storageBucket: "",
  messagingSenderId: "399043506173",
  appId: "1:399043506173:web:41f8346d4bc3c5e0"
});

const firestore = fb.firestore();

export { firestore };