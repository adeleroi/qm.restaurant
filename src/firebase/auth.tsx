import { type User, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

type Status = 'idle' | 'pending' | 'complete' | 'loading';
export function useFirebaseAuth(): {loading: boolean, complete: boolean, data: User|null} {
    const [ status, setStatus ] = React.useState<Status>('idle');
    const [ user, setUser ] = React.useState<User|null>(null);
    
    React.useEffect(() => {
        setStatus('pending')
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user);
            setStatus('complete');
        })
        return unsubscribe;
    }, [])
    
    const loading = status !== 'complete';
    const complete = status === 'complete';


    if (status !== 'complete') return {loading, complete, data: user};

    return {loading, complete, data: user};
}
