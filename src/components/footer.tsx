import { LanguageSelect } from "./language";
import { Logo } from "./logo";

export function Footer() {
    return (
        <footer className="flex justify-center h-96 px-24 mt-16 pt-16 bg-smoke">
            <div className="flex flex-1 flex-col items-start justify-center gap-8">
                <div className="w-full flex items-center flex-col justify-center  border-b-[1px] pb-2">
                    <Logo/>
                    <ul className="mt-16 flex w-80 justify-between">
                        <LanguageSelect triggerElement={<li className="hover:text-gray-400 cursor-pointer">English</li>}/>
                        <li className="hover:text-gray-400 cursor-pointer">Signup to deliver</li>
                        <li className="hover:text-gray-400 cursor-pointer">About us</li>
                    </ul>
                </div>
                <div className="flex justify-between w-full items-center">
                    <div className="flex gap-2">
                        <img alt="appstore" src="https://store.quickmarket.ca/img/appstore.png" className="w-32"></img>
                        <img alt="playstore" src="https://store.quickmarket.ca/img/playmarket.png"className="w-32"></img>
                    </div>
                    <div>
                        <p className="text-xs">&copy; 2024 Quick market, inc.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
