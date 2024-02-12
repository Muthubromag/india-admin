import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHSx-4dUTLlm8GJgxfRcJ-2COepIMdSAw",
  authDomain: "bromag2.firebaseapp.com",
  projectId: "bromag2",
  storageBucket: "bromag2.appspot.com",
  messagingSenderId: "699817199778",
  appId: "1:699817199778:web:eaebe00b4eaea60516effb",
  measurementId: "G-VYHH13V6J1"
};

  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);