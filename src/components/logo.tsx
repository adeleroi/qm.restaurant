import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../firebase/auth"


export function Logo({ to="restaurant" }: { to?: string }) {
    const { loggedIn } = useFirebaseAuth();
    return (
        <Link to={loggedIn ? to : '/'}>
            <div className="cursor-pointer">
                <p className="font-montserrat font-bold text-2xl">
                    <span className="text-defaultGreen">Quick</span>
                    <span className="">Market</span>
                </p>
            </div>
        </Link>
    )
}
