import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../firebase/auth"


export function Logo({ to="restaurant" }: { to?: string }) {
    const { loggedIn } = useFirebaseAuth();
    return (
        <Link to={loggedIn ? to : '/'}>
            <div className="cursor-pointer">
                <p className="font-roboto font-bold text-2xl">
                    <span className="text-defaultGreen">Q</span>
                    <span>uickmarket</span>
                </p>
            </div>
        </Link>
    )
}
