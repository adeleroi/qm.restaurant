import { SearchPosition } from "./search";

export function Hero() {
    return (
        <div className="bg-[url('/hero.jpeg')] w-full h-screen flex justify-center  bg-cover flex-col items-center">
            <p className="text-black font-bold text-4xl w-[48rem] text-center mb-6">
                Order groceries and dishes for delivery today!
            </p>
            <span className="text-xl mb-4 font-medium">Get delivered anywhere in <span className="font-bold">Ottawa</span> and <span className="font-bold">Gatineau</span></span>
            <SearchPosition/>
        </div>
    )
}
