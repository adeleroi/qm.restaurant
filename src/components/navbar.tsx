import { Link } from "react-router-dom";
import { Button } from "../utils/button";
import { Logo } from "./logo";
import { Search } from "./search";
import { useLoginAction } from "../context/hooks";
import { AuthTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CartIcon, CartTrigger } from "./cart";

export function Navbar() {
    const { setAction } = useLoginAction();
    return (
        <nav className="flex w-full py-[0.5rem] px-16 items-center gap-2 sticky top-0 z-20 bg-white shadow-xl">
            <div className="w-68 flex items-center justify-start gap-4">
                <Menu/>
                <Link to="/">
                    <Logo/>
                </Link>
            </div>
            <Search/>
            <div className="flex w-80 gap-2 items-center justify-end">
                <AuthTrigger
                    triggerElement={
                        <Button size="small" onClick={() => setAction('login')} className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black">
                            Log in
                        </Button>
                    }
                />
                <AuthTrigger
                    triggerElement={
                        <Button size="small" onClick={() => setAction('signup')} className="h-8 border-none shadow-custom hover:bg-gray-800 focus:bg-gray-700 bg-black text-white">
                            Sign up
                        </Button>
                    }
                />
            </div>
            <div className="">
                <CartTrigger
                    triggerElement={
                        <Button size="small"  className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black relative">
                            <CartIcon/>
                        </Button>
                    }
                />
            </div>
        </nav>
    )
}
