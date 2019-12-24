const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBTfH9en075CKmOwoJuJbTCyqBforggU7g',
//   authDomain: "notes-5211e.firebaseapp.com",
//   databaseURL: "https://notes-5211e.firebaseio.com",
//   projectId: "notes-5211e",
//   storageBucket: "",
//   messagingSenderId: "399043506173",
//   appId: "1:399043506173:web:41f8346d4bc3c5e0"
// });
// const firestore = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest(async (request, response) => {
  response.send("Hello from Firebase!");
});

// exports.test = functions.https.onRequest(async (request, response) => {
//   let result = await firestore
//     .collection('notes')
//     .get();

//   result = result.map(doc => doc.doc());

//   console.log('Firestore result: ', result);
//   response.send(result);
// });