import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

import axios from 'axios'
import {firebaseConfig} from './credentials'

// PASTE FIRESTORE CREDENTIALS HERE


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    console.log(user)
    await axios.post(`http://localhost:8000/users/create/${user.uid}`).then(
      (res) => {
        console.log(res.data['access_token']);
        localStorage.setItem("jwt-token", res.data['access_token'])
      }
    )
  } catch (err) {
    console.error(err);
    alert(err.message);
    return null;
  }
  return true
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    let res = await signInWithEmailAndPassword(auth, email, password);
    let uid = res.user.uid
    let token = await axios.post("http://localhost:8000/users/token/create",
    {
      "uid":uid
    }).then((res) => {
      console.log(res.data['access_token']);
      localStorage.setItem("jwt-token", res.data['access_token'])
    })

    return true;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return null;
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log(user)
    await axios.post(`http://localhost:8000/users/create/${user.uid}`).then(
      (res) => {
        console.log(res.data['access_token']);
        localStorage.setItem("jwt-token", res.data['access_token'])
      }
    )
    return user.uid;

  } catch (err) {
    console.error(err);
    alert(err.message);
    return null;
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};