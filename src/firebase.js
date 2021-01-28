import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD8FpZkXbsfIznq0kTyvgM_f8LgnQ8lauQ",
    authDomain: "portarch-4f70e.firebaseapp.com",
    databaseURL: "https://portarch-4f70e.firebaseio.com",
    projectId: "portarch-4f70e",
    storageBucket: "portarch-4f70e.appspot.com",
    messagingSenderId: "181172866855",
    appId: "1:181172866855:web:fa951ef96f304989a2e302"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;