import { Button } from "./button";
import { Logo } from "./logo";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CarTriggerForCheckout, CartIcon } from "./cart/cart";
import { useFirebaseAuth } from "../firebase/auth";
import clsx from "clsx";
import { GooglePlace } from "../user-location/new-google-place-autocomplete";
import { forwardRef } from "@chakra-ui/react";
import { IconMarker } from "./store-info/map-mapbox";
import { SearchSwitcher } from "./search/global-search-bar";
import { useLocation } from "react-router-dom";

export function Navbar() {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <nav className="flex justify-between w-full py-2 px-16 items-center bg-white border-b-[1px] border-gray-200 gap-2 top-0 z-40 sticky">
            <div className="mr-8 flex items-center justify-start gap-4">
                { isLandingPage ? null: <Menu/> }
                <Logo/>
            </div>
            <GooglePlace>
                <AddressButton />
            </GooglePlace>
            <div className={clsx("w-full flex-1 justify-center px-4", { "hidden": isLandingPage })}>
                <SearchSwitcher />
            </div>
            <div className="ml-8">
                <ButtonSection/>
            </div>
        </nav>
    )
}

const AddressButton = forwardRef((props, ref) => {
    return (
        <button ref={ref} {...props} className="relative ml-10 cursor-pointer font-bold text-black px-2 h-12 rounded-3xl flex items-center justify-center">
            <IconMarker className="absolute -left-6 top-[5px]" bg="#000"/>
            <p className="text-[18px] truncate text-black">75 Daly Ave</p>
        </button>
    )
})

function ButtonSection() {
    const { setAction } = useLoginFormAction();
    const { loading, complete, data: user }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth();

    if (loading) return null;

    if (complete && user) {
        return (
            <>
                <CarTriggerForCheckout triggerElement={
                    <button className="group/cartbtn py-[9px] pr-4 pl-3 max-w-[80px] rounded-3xl shadow-custom bg-defaultGreen hover:bg-green-800 hover:shadow-custom text-black relative">
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
