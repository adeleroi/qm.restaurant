import { ActionFunctionArgs, redirect } from "react-router-dom";
import { loginAnonymously } from "../../firebase/auth";
import { setAddress } from "../../firebase/fireStore";

export async function HomeAction({ request } : ActionFunctionArgs) {
    const location = await request.json();
    console.log('action', location);
    const userCredential = await loginAnonymously();
    await setAddress(location, userCredential.user.uid);

    return redirect('/feed');
}
