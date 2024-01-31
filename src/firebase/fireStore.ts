import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp } from ".";

const db = getFirestore(firebaseApp);
const someCollection = collection(db, 'collectionName');
export const snapshot = await getDocs(someCollection);