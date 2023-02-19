import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { toastConfig } from "../constants/ToastConfig";
// Initialize Firebase and Firestore
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyBvMX5O2k3kluqdNz51dexX-Nzywi1EXHM",
  authDomain: "ticket-booking-bffbf.firebaseapp.com",
  projectId: "ticket-booking-bffbf",
  storageBucket: "ticket-booking-bffbf.appspot.com",
  messagingSenderId: "65145832799",
  appId: "1:65145832799:web:64a3b124bdb9a1702062ea",
  measurementId: "G-MPBQZG52JV",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(res.user);
    await sendPasswordResetEmail(auth, email);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    toast.error(err.message, toastConfig);
  }
};

export const deleteUserAccount = async (docId) => {
  try {
    await deleteDoc(doc(db, "users", docId));
  } catch (err) {
    console.error(err);
    toast.error(err.message, toastConfig);
  }
};

export const addUser = (user, email, role = "agent") => {
  return addDoc(collection(db, "users"), {
    uid: user.uid,
    authProvider: "local",
    role,
    email,
  });
};

export const getUser = (email) => {
  return query(collection(db, "users"), where("email", "==", email));
};

export const getConfiguration = () => {
  return query(collection(db, "configuration"));
};
export const getUsersList = () => {
  return query(collection(db, "users"));
};

export const updateUserProfile = (id, data) => {
  return updateDoc(doc(db, "users", id), data);
};

export const setConfiguration = (config) => {
  return setDoc(doc(db, "configuration", "FurypQZ3fyAE9KOU6nRY"), config, {
    merge: true,
  });
};

export const insertBookings = async (id, passengersList) => {
  console.log("id", id);
  const date = new Date();
  console.log("date", date.getTime());
  console.log({
    bookings: {
      [date.getTime()]: passengersList,
    },
  });

  const docRef = doc(db, "users", id);
  const document = await getDoc(docRef);
  console.log("earlier", document.data());
  const user = document.data();

  const bookings = (user.bookings = {
    ...user.bookings,
    [date.getTime()]: passengersList,
  });
  return updateDoc(doc(db, "users", id), { bookings });
};

export const setSeats = (data) => {
  return setDoc(
    doc(db, "seats", "dBWVIiXWPytOX6FP4nPH"),
    {
      seatMatrix: JSON.stringify(data),
    },
    {
      merge: true,
    }
  );
};

export const getSeats = () => {
  const docRef = doc(db, "seats", "dBWVIiXWPytOX6FP4nPH");
  return getDoc(docRef);
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  return signOut(auth);
};

export { getDocs, onSnapshot, doc };
