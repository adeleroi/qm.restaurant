import { type User, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
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

type Status = 'idle' | 'pending' | 'complete' | 'loading';
export function useFirebaseAuth(): {status: Status, data: User|null} {
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

    if (status !== 'complete') return {status:'loading', data: user};

    return {status: 'complete', data: user};
}
