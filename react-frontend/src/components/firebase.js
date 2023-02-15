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
    var returnObj;
    console.log(user)
    await axios.post(`http://localhost:8000/users/create/${user.uid}`)
    .then(
      (res) => {
        returnObj = res
      }
    )
  } catch (err) {
    console.error(err);
    alert(err.message);
    return null;
  }
  return returnObj;
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    let res = await signInWithEmailAndPassword(auth, email, password);
    let uid = res.user.uid
    let returnObj;
    await axios.post("http://localhost:8000/users/token/create",
    { "uid":uid })
    .then((res) => {
      returnObj = res
      // return res.data['access_token']
      // console.log(res.data['access_token']);
      // localStorage.setItem("jwt-token", res.data['access_token'])
    })

    return returnObj;
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
    let returnObj;
    await axios.post(`http://localhost:8000/users/create/${user.uid}`)
    .then(
      (res) => {
        returnObj = res;
        // console.log(res.data['access_token']);
      }
    )
    return returnObj;

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