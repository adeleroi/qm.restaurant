import { GoogleAutocomplete, SearchResult } from "../user-location/new-google-place-autocomplete";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { useFetcher } from "react-router-dom";
import Cookies from "js-cookie";


const library = ['places'] as Libraries;

export function Hero() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
        libraries: library,
    })
    const isAnonymousUser = !Cookies.get('qm_session_id');
    const fetcher = useFetcher();

    function handleSelection(location: SearchResult) {
        if (location) {
            const formData = new FormData();
            const intent = isAnonymousUser ? 'set_anonymous_delivery_address' : 'set_delivery_address';
            formData.append('location', JSON.stringify(location));
            formData.append('intent', intent);
            fetcher.submit(
                formData,
                { method: 'post', action: "/", encType: "multipart/form-data" }
            )
        }
    }

    return (
        <div className="bg-[rgb(208_229_193)] w-full h-[80vh] flex justify-center bg-cover flex-col items-start pl-32">
            <p className="text-black font-black text-5xl w-[34rem] text-left mb-10 leading-tight">
                Order groceries and dishes for delivery now!
            </p>
            <p className="text-xl mb-4 font-medium">Get delivered anywhere in <span className="font-bold">Ottawa</span> and <span className="font-bold">Gatineau</span></p>
            <div className="w-[500px]">
                { isLoaded ? 
                <GoogleAutocomplete
                    setSearchResult={handleSelection}
                    iconStyle="absolute top-1/2 -translate-y-1/2 left-2"
                    containerStyle="h-14 px-0 relative"
                /> : null
                }
            </div>
        </div>
    )
}
