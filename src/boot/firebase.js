import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth'

var firebaseConfig = {
  apiKey: "AIzaSyCcSeCC4qD_bBTep2g9V-TdWY4Tv4tminA",
  authDomain: "my-app-983b8.firebaseapp.com",
  projectId: "my-app-983b8",
  storageBucket: "my-app-983b8.appspot.com",
  messagingSenderId: "331591929806",
  appId: "1:331591929806:web:f82fda33d8b8d2610c259f",
  measurementId: "G-M6QH5TE119"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firestore = firebaseApp.firestore();

export { firebaseAuth, firestore }