import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../firebase/auth"


export function Logo() {
    const { loggedIn } = useFirebaseAuth();
    return (
        <Link to={loggedIn ? "store" : '/'}>
            <div className="cursor-pointer">
                <p className="font-roboto font-bold text-2xl">
                    <span className="text-defaultGreen">Q</span>
                    <span>uickmarket</span>
                </p>
            </div>
        </Link>
    )
}
