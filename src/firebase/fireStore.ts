import { collection, connectFirestoreEmulator, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseApp } from ".";
import { SearchResult } from "../user-location/new-google-place-autocomplete";

export const db = getFirestore(firebaseApp);

connectFirestoreEmulator(db, '127.0.0.1', 8080)

export const productCollection = collection(db, 'product');
export const storeCollection = collection(db, 'store');
export const restaurantCollection = collection(db, 'restaurant');

export async function createUser(uid: string, email: string) {
    await setDoc(doc(db, 'users', uid), {
        email: email,
        country: 'Canada',
        PhoneNumber: '5817774338',
        location: null,
        timestamp: serverTimestamp(),
    })
}

export async function setAddress(address: SearchResult, uid: string) {
    return setDoc(doc(db, 'users', uid), {
        location: address,
        timestamp: serverTimestamp(),
    })
}
