import { collection, connectFirestoreEmulator, deleteDoc, doc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from ".";
import { SearchResult } from "../user-location/new-google-place-autocomplete";
import { v4 as uuidv4 } from 'uuid';

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
        timestamp: serverTimestamp(),
    })
}

export async function setAddress(address: SearchResult, uid: string) {
    return setDoc(doc(db, 'users', uid, 'addresses', uuidv4()), {
        ...address,
        timestamp: serverTimestamp(),
    })
}

export async function updateAddress(address: SearchResult, uid: string, addressId: string) {
    return updateDoc(doc(db, 'users', uid, 'addresses', addressId), {
        ...address,
        timestamp: serverTimestamp(),
    })
}

export async function deleteAddress(uid: string, addressId: string) {
    return deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
}
