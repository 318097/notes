import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "notes-5211e.firebaseapp.com",
  databaseURL: "https://notes-5211e.firebaseio.com",
  projectId: "notes-5211e",
  storageBucket: "",
  messagingSenderId: "399043506173",
  appId: "1:399043506173:web:41f8346d4bc3c5e0"
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = async () => auth.signInWithPopup(provider);

const createNewFirebaseUser = async ({ email, uid, name }) =>
  await firestore
    .collection("users")
    .doc(uid)
    .set({
      email,
      name,
      userId: uid
    });

export { firestore, auth, signInWithGoogle, createNewFirebaseUser };
