import React from "react";
import {
    type User,
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    signInAnonymously,
    signInWithPopup,
    getAdditionalUserInfo
} from "firebase/auth";
import { firebaseApp } from ".";
import Cookies from 'js-cookie';

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

const googleProvider = new GoogleAuthProvider();
// googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')

connectAuthEmulator(auth, "http://localhost:9099");

export async function signupEmailPassword (email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user.uid) {
        // Cookies.set('qm_session_id', userCredential.user.uid);
    }
    return userCredential;
}

export async function loginEmailPassword(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user.uid) {
        // Cookies.set('qm_session_id', userCredential.user.uid);
    }
    console.log('Login -->', getAdditionalUserInfo(userCredential));
    return userCredential;
}

export async function googleSignInWithPopup() {
    const result = await signInWithPopup(auth, googleProvider);
    const userCredential = GoogleAuthProvider.credentialFromResult(result);
    // const token = userCredential?.accessToken;
    const user = result.user;

    // console.log('user', user);
    console.log('userCredential', getAdditionalUserInfo(result));
    console.log('result --->', result);
    return user;
}

export async function signout() {
    signOut(auth).then(() => {
        Cookies.remove('qm_session_id');
    });
}

export async function loginAnonymously() {
    return signInAnonymously(auth);
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
