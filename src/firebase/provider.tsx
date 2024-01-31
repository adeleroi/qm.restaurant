import { User, onAuthStateChanged } from "firebase/auth";
import React from "react"
import { auth, firebaseContext } from "./auth";



type Status = 'idle' | 'pending' | 'complete' | 'loading';

export type TUseFirebaseAuth = {
    loading: boolean,
    complete: boolean,
    data: User|null,
    loggedIn: boolean,
    loggedOut: boolean,
}

export function FirebaseAuthProvider( {children }: { children?: React.ReactNode}) {
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
    const loggedIn = status === 'complete' && Boolean(user?.uid);
    const loggedOut = status === 'complete' && !user?.uid
    const authState = { loading, complete, loggedIn, loggedOut, data: user };

    return (
        <firebaseContext.Provider value={authState}>
            { children }
        </firebaseContext.Provider>
    )
}
