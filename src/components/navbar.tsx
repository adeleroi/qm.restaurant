import { Button } from "./button";
import { Logo } from "./logo";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CarTriggerForCheckout, CartIcon } from "./cart/cart";
import { useFirebaseAuth } from "../firebase/auth";
import clsx from "clsx";
import { GooglePlace, UserType } from "../user-location/new-google-place-autocomplete";
import { forwardRef } from "@chakra-ui/react";
import { SearchSwitcher } from "./search/global-search-bar";
import { useLoaderData, useLocation } from "react-router-dom";
import { CustomMarker } from "./icons/icon";

export function Navbar() {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <nav className="flex justify-between w-full py-2 px-16 items-center bg-white border-b-[1px] border-gray-200 gap-2 top-0 z-40 sticky">
            <div className="mr-8 flex items-center justify-start gap-4">
                { isLandingPage ? null: <Menu/> }
                <Logo/>
            </div>
            {
                isLandingPage ? null :
                <GooglePlace>
                    <AddressButton />
                </GooglePlace>
            }
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
    const { user } = useLoaderData() as { user: UserType };
    return (
        <button ref={ref} {...props} className="group relative cursor-pointer text-black px-2 h-12 rounded-3xl flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center">
                <CustomMarker fill="#099500" width={20} height={20}/>
            </div>
            { user?.location?.address ? 
                <p className="truncate font-semibold text-[15px] text-defaultGreen w-32">{ user.location.address.split(',')[0] }</p>
                :
                <p className="truncate font-semibold text-[15px] text-defaultGreen w-32">Your address</p>
            }
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
                    <button className="group/cartbtn py-[9px] pr-4 pl-3 rounded-3xl shadow-custom bg-defaultGreen hover:bg-green-800 hover:shadow-custom text-black relative">
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
                    <Button size="small" onClick={() => setAction('login')} className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black font-semibold">
                        Log in
                    </Button>
                }
            />
            <AuthFormTrigger
                triggerElement={
                    <Button size="small" onClick={() => setAction('signup')} className="h-8 border-none shadow-custom hover:bg-gray-800 focus:bg-gray-700 bg-defaultGreen text-white font-semibold">
                        Sign up
                    </Button>
                }
            />
        </div>
    )
}
