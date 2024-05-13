// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBDl6hJiJ89iJVrtAJja8UBUEecSXS3_TI",
    authDomain: "book-library-9b61a.firebaseapp.com",
    projectId: "book-library-9b61a",
    storageBucket: "book-library-9b61a.appspot.com",
    messagingSenderId: "372260281123",
    appId: "1:372260281123:web:c61c6473c981a5ccd90a96"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }; // Export firestore instead of app
