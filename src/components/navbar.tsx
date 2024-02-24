import { Button } from "./button";
import { Logo } from "./logo";
import { Search } from "./search";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CarTriggerForCheckout, CartIcon } from "./cart/cart";
import { useFirebaseAuth } from "../firebase/auth";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

const regex = /[a-z]+/i;


export function Navbar() {
    const { loggedIn } = useFirebaseAuth();
    const currLocation = useLocation();
    const location: string | undefined = currLocation.pathname.match(regex)?.[0];

    return (
        <nav className="flex justify-between w-full py-2 px-16 items-center bg-white border-b-[1px] border-gray-200 gap-2 top-0 z-40 sticky">
            <div className="mr-8 flex items-center justify-start gap-4">
                { loggedIn ? <Menu/> : null }
                <Logo/>
            </div>
            <button className="w-44 cursor-pointer focus:border-2 focus:border-black text-lg font-bold text-black px-3 py-2 bg-gray-100 rounded-3xl flex gap-2 items-center justify-center">
                <span className="material-symbols-outlined font-black text-lg">location_on</span>
                <p className="text-[15px]">75 Daly Ave</p>
            </button>
            <div className={clsx("w-full flex-1 justify-center px-4", { "hidden": !loggedIn })}>
                <Search searchType={location}/>
            </div>
            <div className="ml-8">
                <ButtonSection/>
            </div>
        </nav>
    )
}

function ButtonSection() {
    const { setAction } = useLoginFormAction();
    const { loading, complete, data: user }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth();

    if (loading) return null;

    if (complete && user) {
        return (
            <>
                <CarTriggerForCheckout triggerElement={
                    <button className="group/cartbtn py-2 pr-4 pl-3 max-w-[80px] rounded-3xl shadow-custom bg-defaultGreen hover:bg-green-800 hover:shadow-custom text-black relative">
                        <CartIcon/>
                    </button>
                }/>
            </>
        )
    }
    return (
        <div className="flex w-80 gap-2 items-center justify-end">
            <AuthFormTrigger
                triggerElement={
                    <Button size="small" onClick={() => setAction('login')} className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black">
                        Log in
                    </Button>
                }
            />
            <AuthFormTrigger
                triggerElement={
                    <Button size="small" onClick={() => setAction('signup')} className="h-8 border-none shadow-custom hover:bg-gray-800 focus:bg-gray-700 bg-black text-white">
                        Sign up
                    </Button>
                }
            />
        </div>
    )
}
