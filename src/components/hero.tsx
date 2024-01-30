import { ArrowPulseButton } from "../utils/button";

export function Hero() {
    return (
        <div className="bg-[url('/hero.jpeg')] w-full h-[40rem] flex justify-center pl-48 items-start bg-cover flex-col">
            <p className="text-black font-bold text-6xl w-[44rem] text-left mb-16">
                Order groceries or dishes for delivery today
            </p>
            <span className="text-2xl mb-8">Get delivered anywhere in <span className="font-bold">Ottawa</span> and <span className="font-bold">Gatineau</span></span>
            <a href="#grocery-store">
                <ArrowPulseButton text="Get started" variant="primary" size="medium" className="w-[9rem] h-12" direction="bottom"/>
            </a>
        </div>
    )
}