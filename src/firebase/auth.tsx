import { type User, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseApp } from ".";
import React from "react";

export const auth = getAuth(firebaseApp)

connectAuthEmulator(auth, "http://localhost:9099");

export async function signupEmailPassword (email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
}

export async function loginEmailPassword(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
}

export async function signout() {
    console.log('signed out')
    await signOut(auth);
}

type TUseFirebaseAuth = {
    loading: boolean,
    complete: boolean,
    data: User|null,
    loggedIn: boolean,
    loggedOut: boolean,
}

export const firebaseContext = React.createContext<TUseFirebaseAuth|null>(null);

export function useFirebaseAuth() {
    const context = React.useContext(firebaseContext);
    if (!context) {
        throw new Error('useFirebaseAuth hooks should only be used within FirebaseAuthProvider!')
    }
    return context;
}
