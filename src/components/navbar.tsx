import { Button } from "./button";
import { Logo } from "./logo";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { CarTriggerForCheckout, CartIcon } from "./cart/cart";
import { useFirebaseAuth } from "../firebase/auth";
import clsx from "clsx";
import { GooglePlace, SearchResult } from "../user-location/new-google-place-autocomplete";
import { SearchSwitcher } from "./search/global-search-bar";
import { useLoaderData, useLocation } from "react-router-dom";
import { CustomMarker } from "./icons/icon";
import { ProfileMenu } from "./profile-menu";

export function Navbar() {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    const { loggedIn } = useFirebaseAuth();

    return (
        <nav className="flex justify-between min-h-16 w-full py-2 px-16 items-center bg-white border-b-[1px] border-gray-200 gap-2 top-0 z-40 sticky">
            <div className="mr-8 flex items-center justify-start gap-4">
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
            {
                loggedIn && !isLandingPage ?
                <div className="ml-8">
                    <ProfileMenu/>
                </div> :
                null
            }
            <div className="ml-8">
                <ButtonSection isLandingPage={isLandingPage}/>
            </div>
        </nav>
    )
}

function AddressButton ({ onClick, ...rest } : { onClick?: () => void }) {
    const { addresses } = useLoaderData() as { addresses: Array<SearchResult> };
    const currentAddress = addresses[0];
    return (
        <button onClick={onClick} {...rest} className="group relative cursor-pointer text-black pr-2 pl-1 h-12 rounded-3xl flex justify-center items-center bg-gray-100">
            <div className="w-10 h-10 rounded-full bg-white border-gray-300 border-2 group-hover:bg-gray-100 flex items-center justify-center">
                <CustomMarker fill="#4b5563" width={16} height={16}/>
            </div>
            { currentAddress?.address ? 
                <p className="font-semibold truncate text-[15px] text-[#4b5563] w-32 pl-2">{ currentAddress?.address.split(',')[0] }</p>
                :
                <p className="truncate font-semibold text-[14px] text-black w-32">Your address</p>
            }
        </button>
    )
}

function ButtonSection({ isLandingPage } : { isLandingPage: boolean }) {
    const { setAction } = useLoginFormAction();
    const { loading, complete, data: user }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth();
    const displayCartButton = complete && user && !isLandingPage;
    const displayAuthButtons = !user || user && user?.isAnonymous;

    if (loading) return null;

    const cartButton = (
        <CarTriggerForCheckout triggerElement={
            <button className="group/cartbtn py-[9px] pr-4 pl-3 rounded-3xl shadow-custom bg-defaultGreen hover:bg-green-800 hover:shadow-custom text-black relative">
                <CartIcon/>
            </button>
        }/>
    )

    const authButtons = (
        <div className="flex gap-2 items-center justify-end">
            <AuthFormTrigger
                triggerElement={
                    <span onClick={() => setAction('signup')} className="mr-2 hover:text-gray-800 text-black font-semibold cursor-pointer">
                        Sign up
                    </span>
                }
            />
            {
                !user ? 
                    <AuthFormTrigger
                        triggerElement={
                            <Button size="small" onClick={() => setAction('login')} className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black font-semibold">
                                Log in
                            </Button>
                        }
                    />
                : null
            }
        </div>
    )

    return (
        <div className="flex gap-2">
            { displayAuthButtons ? authButtons : null }
            { displayCartButton ? cartButton : null }
        </div>
    )
}
