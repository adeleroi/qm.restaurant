import { Button } from "./button";
import { Logo } from "./logo";
import { Search } from "./search";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CartIcon, CartTrigger } from "./cart";
import { useFirebaseAuth } from "../firebase/auth";

export function Navbar() {
    return (
        <nav className="flex justify-between w-full py-[0.5rem] px-16 items-center bg-white shadow-xl gap-2 top-0 z-20  sticky">
            <div className="w-68 flex items-center justify-start gap-4">
                <Menu/>
                <Logo/>
            </div>
            <div className="hidden">
                <Search/>
            </div>
            <ButtonSection/>
        </nav>
    )
}

function ButtonSection() {
    const { setAction } = useLoginFormAction();
    const { loading, complete, data: user }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth()

    if (loading) return null;

    if (complete && user) {
        return (
            <CartTrigger
                triggerElement={
                    <Button size="small"  className="h-8 shadow-custom bg-white hover:bg-gray-100 text-black relative">
                        <CartIcon/>
                    </Button>
                }
            />
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
