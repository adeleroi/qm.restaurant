import React from "react";
import { GoogleAutocomplete, SearchResult } from "../user-location/new-google-place-autocomplete";
import { Libraries, useLoadScript } from "@react-google-maps/api";

const library = ['places'] as Libraries
export function Hero() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
        libraries: library,
    })
    const [ , setSearchResult ] = React.useState<SearchResult | null | undefined>(null);

    return (
        <div className="bg-[rgb(208_229_193)] w-full h-[80vh] flex justify-center bg-cover flex-col items-start pl-32">
            <p className="text-black font-black text-5xl w-[35rem] text-left mb-10 leading-tight">
                Order groceries and dishes for delivery today!
            </p>
            <p className="text-xl mb-4 font-medium">Get delivered anywhere in <span className="font-bold">Ottawa</span> and <span className="font-bold">Gatineau</span></p>
            <div className="w-[500px]">
                { isLoaded ? 
                <GoogleAutocomplete
                    setSearchResult={setSearchResult}
                    iconStyle="absolute top-1/2 -translate-y-1/2 left-2"
                    containerStyle="h-14 px-0 relative"
                /> : null
                }
            </div>
        </div>
    )
}
