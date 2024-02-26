import { Libraries, useLoadScript } from "@react-google-maps/api";
import React, { LegacyRef } from "react";
import usePlacesAutocomplete, {
    // GeocodeResult,
    getGeocode,
    getLatLng,
    getZipCode
} from "use-places-autocomplete";
import { useRelativeResize } from "../components/search";

export type LatLng = { lat: number, lng: number };

// function getSimpleAddress(results: GeocodeResult, useShortName: boolean=true) {
//     const foundStreetNumber = results.address_components.find(({ types }) => types.includes("street_number"));
//     const foundRoute = results.address_components.find(({ types }) => types.includes("route"));

//     if (!foundRoute || !foundStreetNumber) return undefined;

//     const key = useShortName ? 'short_name' : 'long_name';
//     const result = `${foundStreetNumber[key]} ${foundRoute[key]}`;
//     return result
// }

export type SearchResult = LatLng & {
    postalCode: string | undefined,
    address: string | undefined,
}

type PlaceProps = {
    setSelected(t: SearchResult): void,
}

const library = ["places"] as Libraries;
export function GooglePlace({ setSelected } : PlaceProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
        libraries: library,
    })

    return isLoaded ? <PlacesAutoComplete setSelected={setSelected}/> : null;
}


function PlacesAutoComplete({ setSelected } : PlaceProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const suggestionRef = React.useRef<HTMLUListElement | null>(null)
    // const sessionToken = React.useRef(new google.maps.places.AutocompleteSessionToken());
    // console.log(sessionToken.current);

    const { 
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
     } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: ["CA"] },
            // sessionToken,
            types: ["address"],
            
        }
     });

    async function handleSelect(address:string) {
        setValue(address, false);
        clearSuggestions();
        const results = await getGeocode({ address, componentRestrictions: { country: "CA" } });
        const { lat, lng } = getLatLng(results[0]);
        const postalCode = getZipCode(results[0], true);
        setSelected({ lat, lng, postalCode, address  })
    }

    useRelativeResize(inputRef, suggestionRef);

    return (
        <div>
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="focus:border-black focus:border-2 p-2 bg-gray-100 w-full rounded-lg outline-none" autoComplete="off" />
            { status === 'OK' ? <PlacesSuggestions ref={suggestionRef} results={data} onSelect={handleSelect}/> : null }
        </div>
    )
}

type PlacesSuggestionProps = {
    results: Array<google.maps.places.AutocompletePrediction>,
    onSelect: (t:string) => void,
}

const PlacesSuggestions = React.forwardRef(function SearchSuggestion({ results, onSelect } : PlacesSuggestionProps, ref) {
    function handleClick(address: string) {
        onSelect(address);
    }

    return (
        <ul tabIndex={1} ref={ref as LegacyRef<HTMLUListElement> | undefined} className="p-3 bg-white z-100 opacity-100 shadow-custom rounded-md overflow-y-scroll">
            {
                results?.map(({ place_id, description}) => {
                    return (
                        <li className="rounded-lg flex hover:bg-gray-100 py-3 cursor-pointer"
                            key={ place_id }
                            onClick={() => handleClick(description)}
                        >
                            <div className="flex pl-3 text-[14px] font-medium items-center">
                                <span className="material-symbols-outlined">location_on</span>
                                <div className="ml-3">
                                    <p>{ description }</p>
                                </div>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
})
