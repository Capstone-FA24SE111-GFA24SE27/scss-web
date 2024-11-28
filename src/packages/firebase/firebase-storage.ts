import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "./firebase-config";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp);