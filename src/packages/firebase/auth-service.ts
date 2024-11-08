import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut as  signOutFirebase} from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

const firebaseApp = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);

auth.languageCode = 'vi';

export const signInWithPopupGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};


export const signOutGoogle = async () => {
  await signOutFirebase(auth);
};