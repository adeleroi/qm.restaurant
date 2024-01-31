import clsx from "clsx"
import { CirclePulseButton } from "./button"

export function Search() {
    return (
        <div className="w-full rounded-md relative py-1 focus:border-b-[2px] focus:border-black mx-8">
            <SearchLogo className="text-[20px] absolute top-1/2 -translate-y-1/2 left-2 text-black"/>
            <input
                placeholder="Restaurants, groceries, Food, etc"
                className="focus:shadow-search transition-[box-shadow] ease-in-out delay-150 w-full p-9 py-3 bg-[#EEEEEE] outline-none placeholder:font-semibold placeholder:text-gray-600"
            />
        </div>
    )
}

function SearchLogo({ className }: { className: string }) {
    return (
        <span className={clsx("material-symbols-outlined font-semibold", className)}>
            search
        </span>
    )
}

function PositionLogo({ className }: { className: string }) {
    return (
        <span className={clsx("material-symbols-outlined font-semibold text-[30px]", className)}>
            explore_nearby
        </span>
    )
}

export function SearchPosition() {
    return (
        <div id="search-location" className="w-[550px] relative py-1 focus:border-b-[2px] focus:border-black">
            <PositionLogo className="text-[20px] absolute top-1/2 -translate-y-1/2 left-2 text-defaultGreen"/>
            <input
                placeholder="Enter delivery address"
                className="h-16 text-xl text-black focus:shadow-search transition-[box-shadow] ease-in-out delay-150 w-full px-12 py-3 bg-[#EEEEEE] outline-none placeholder:font-semibold placeholder:text-gray-600"
            />
            <CirclePulseButton />
        </div>
    )
}
