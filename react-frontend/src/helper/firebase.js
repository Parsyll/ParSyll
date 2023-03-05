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
import {firebaseConfig} from '../components/credentials'
import { setJWTToken } from "./jwt";
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
    await axios.post(`http://localhost:8000/users/create/${user.uid}`)
    .then(
      (res) => {
        returnObj =  {
          access_token : res.data.access_token,
          user : user
        }
      }
    )
  } catch (error) {
    console.error(error);
    return error;
  }
  return returnObj;
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    let res = await signInWithEmailAndPassword(auth, email, password);
    let uid = res.user.uid
    const user = res.user
    let returnObj;
    await axios.post("http://localhost:8000/users/token/create",
    { "uid":uid })
    .then((res) => {
      returnObj = {
        access_token : res.data.access_token,
        user: user
      }
    })

    return returnObj;
  } catch (error) {
    return error;
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    const returnObj = await axios.post(`http://localhost:8000/users/create/${user.uid}`)

    const returnObjWithUser = {
      access_token : returnObj.data.access_token,
      user: user 
    }
    return returnObjWithUser;

  } catch (error) {
    console.log(error)
    return error;
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

const firebaseErrorHandeling = (error) => {
  switch(error.code) {
    case 'auth/email-already-in-use':
        return 'Email already in use !'
    case 'auth/missing-email':
        return 'Email field is missing!'
    case 'auth/invalid-email':
        return 'Email entered is invalid!'
    case 'auth/email-already-in-use':
        return 'Email entered is already in use!'
    case 'auth/wrong-password':
        return 'username or password is incorrect'
    case 'auth/user-not-found':
        return 'username or password is incorrect'
    default:
        return "Oops an error occured. Please try again."
  }
}

const handleGoogleSignIn = async (setLoadingGoogle, setProfilePic, setUserName, 
  displayErrorMessage, rememberMe, login) => {
  setLoadingGoogle(true);
  try {
    var res = await signInWithGoogle();

    if (res instanceof Error) {
      throw res;
    }

    if (res) {
      console.log(res);
      const jwtToken = res["access_token"];
      const user = res.user;
      setProfilePic(user["photoURL"]);
      setUserName(user["displayName"]);
      setJWTToken(jwtToken, rememberMe);
      login();
    }
  } catch (error) {
    console.log(error);
    const errorText = firebaseErrorHandeling(error);
    displayErrorMessage(errorText);
  }
  setLoadingGoogle(false);
}

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  firebaseErrorHandeling,
  handleGoogleSignIn
};