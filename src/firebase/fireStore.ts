import { collection, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { firebaseApp } from ".";

export const db = getFirestore(firebaseApp);

connectFirestoreEmulator(db, '127.0.0.1', 8080)

export const productCollection = collection(db, 'product');
export const storeCollection = collection(db, 'store');
