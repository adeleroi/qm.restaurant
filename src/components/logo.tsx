import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../firebase/auth"


export function Logo({ to="feed" }: { to?: string }) {
    const { data: user } = useFirebaseAuth();
    return (
        <Link to={user && !user.isAnonymous ? to : '/'}>
            <div className="cursor-pointer">
                <p className="font-montserrat font-bold text-2xl">
                    <span className="text-defaultGreen">Quick</span>
                    <span className="">Market</span>
                </p>
            </div>
        </Link>
    )
}
