import React from "react";
import { type User, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseApp } from ".";
import Cookies from 'js-cookie';

export const auth = getAuth(firebaseApp)

connectAuthEmulator(auth, "http://localhost:9099");

export async function signupEmailPassword (email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user.uid) {
        Cookies.set('qm_session_id', userCredential.user.uid);
    }
    return userCredential;
}

export async function loginEmailPassword(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user.uid) {
        Cookies.set('qm_session_id', userCredential.user.uid);
    }
    return userCredential;
}

export async function signout() {
    await signOut(auth);
    Cookies.remove('qm_session_id');
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
