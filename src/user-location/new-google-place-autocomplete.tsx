import { Libraries, useLoadScript } from "@react-google-maps/api";
import React, { LegacyRef, MutableRefObject } from "react";
import usePlacesAutocomplete, {
    // GeocodeResult,
    getGeocode,
    getLatLng,
    getZipCode
} from "use-places-autocomplete";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
  } from '@chakra-ui/react';
import { IconMarker, MapBoxMap } from "../components/store-info/map-mapbox";
import { AddressForm } from "./location-form";
import { useRelativeResize } from "../utils/hooks";

export type LatLng = { lat: number, lng: number };

export type SearchResult = LatLng & {
    postalCode: string | undefined,
    address: string | undefined,
}

const library = ["places"] as Libraries;
export function GooglePlace({ children } : { children: React.ReactNode }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
        libraries: library,
    })

    return isLoaded ? <PlacesAutoComplete >{ children}</PlacesAutoComplete> : null;
}

function PlacesAutoComplete({ children } : { children: React.ReactNode }) {
    const [ searchResult, setSearchResult ] = React.useState<SearchResult | null>();
    const { onClose, isOpen, onOpen } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <Popover
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            initialFocusRef={inputRef}
        >
            <PopoverTrigger>
                { children }
            </PopoverTrigger>
            <PopoverContent  border={''} minW={'30vw'} boxShadow={"1px 7px 25px 8px rgb(0 0 0 / 0.25)"} borderRadius={'12px'} padding={"0px 0px 0px 0px"}>
                <PopoverArrow/>
                <PopoverCloseButton
                    onClick={() => onClose()}
                    style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}} />
                {/* <PopoverHeader border={'none'}>
                    <PopoverTitle searchResult={searchResult} />
                </PopoverHeader> */}
                <PopoverBody padding={"0px 0px 0px 0px"}>
                    <div className="min-h-44 flex flex-col justify-center items-center w-full gap-5">
                    { !searchResult ? <p className="text-center text-lg font-semibold mt-2">Enter your address</p> : null }
                    <GooglePopoverBody searchResult={searchResult} setSearchResult={setSearchResult} isOpen={isOpen} ref={inputRef}/>
                    </div>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

type PlacesSuggestionProps = {
    results: Array<google.maps.places.AutocompletePrediction>,
    onSelect: (t:string) => void,
}

const PlacesSuggestions = React.forwardRef(function SearchSuggestion({ results, onSelect } : PlacesSuggestionProps, ref) {
    function handleClick(address: string) { onSelect(address) }
    return (
        <ul tabIndex={1} ref={ref as LegacyRef<HTMLUListElement> | undefined} className="p-3 bg-white z-100 opacity-100 shadow-custom rounded-md overflow-y-scroll">
            {
                results?.map(({ place_id, description}) => {
                    return (
                        <li className="rounded-lg flex hover:bg-gray-100 py-4 cursor-pointer"
                            key={ place_id }
                            onClick={() => handleClick(description)}
                        >
                            <div className="relative flex pl-3 text-[16px] font-medium items-center">
                                <IconMarker hideShadow className="left-2 top-1/2 -translate-y-1/2 absolute pt-3" bg="#000"/>
                                <div className="ml-8">
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

function PopoverTitle({ searchResult } : { searchResult: SearchResult | null | undefined}) {
    return (
        <h1 className="pt-2 font-semibold max-w-[90%] text-xl">
            {
                searchResult ?
                (
                    <div>
                        <p className='text-md'>{ searchResult.address }</p>
                        <p className='text-md'>({ searchResult.postalCode })</p>
                    </div>
                )
                : <p className="text-center">Enter your address</p>
            }
        </h1>
    )
}

type GooglePopoverBodyProps = {
    searchResult: SearchResult | null | undefined,
    isOpen: boolean,
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResult | null | undefined>>,
}

const GooglePopoverBody = React.forwardRef(function GooglePopoverBody({ setSearchResult, searchResult, isOpen } : GooglePopoverBodyProps, ref) {
    const suggestionRef = React.useRef<HTMLUListElement | null>(null);

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
        setSearchResult({ lat, lng, postalCode, address  })
    }

    useRelativeResize(ref as MutableRefObject<HTMLElement | null>, suggestionRef);

    const handleFormCancel = React.useCallback(function handleFormCancel() {
        setValue("", false);
        clearSuggestions();
        setSearchResult(null);
        (ref as MutableRefObject<HTMLElement>).current?.focus();
    }, [setSearchResult, setValue, clearSuggestions, ref])

    React.useEffect(() => {
        handleFormCancel();
    }, [isOpen, handleFormCancel])

    return (
        <React.Fragment>
            {
                searchResult ?
                    <div className="w-full">
                        <div className="h-56">
                            <MapBoxMap key={searchResult?.lat} latitude={searchResult?.lat} longitude={searchResult?.lng}/>
                        </div>
                        {/* <div className="px-3 flex">
                            <p className='text-md'>{ searchResult.address }</p>
                            <p className='text-md'>({ searchResult.postalCode })</p>
                        </div> */}
                        <AddressForm address={searchResult.address as string} cancel={() => handleFormCancel()}/>
                    </div>
                    : (
                        <div className="px-3 w-full">
                            <input
                                ref={ref as LegacyRef<HTMLInputElement> | undefined}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={!ready}
                                className="focus:border-black focus:border-2 p-2 bg-gray-100 w-full rounded-lg outline-none" autoComplete="off" />
                            { status === 'OK' ? <PlacesSuggestions ref={suggestionRef} results={data} onSelect={handleSelect}/> : null }
                        </div>
                    )
            }
        </React.Fragment>
    )
})
