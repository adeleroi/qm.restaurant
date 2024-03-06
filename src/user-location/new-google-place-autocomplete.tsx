import { Libraries, useLoadScript } from "@react-google-maps/api";
import React, { LegacyRef, MutableRefObject } from "react";
import usePlacesAutocomplete, {
    // GeocodeResult,
    getGeocode,
    getLatLng,
    getZipCode
} from "use-places-autocomplete";
import {
    useDisclosure,
    Modal,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    ModalOverlay,
  } from '@chakra-ui/react';
import { MapBoxMap } from "../components/store-info/map-mapbox";
import { AddressForm } from "./location-form";
import { useRelativeResize } from "../utils/hooks";
import { Trigger } from "../utils/trigger";
import { CustomMarker, GoogleLogo } from "../components/icons/icon";
import clsx from "clsx";

export type LatLng = { lat: number, lng: number };

export type SearchResult = LatLng & {
    id?: string,
    postalCode: string | undefined,
    address: string | undefined,
}

export type UserType = {
    email: string,
    name: string,
    PhoneNumber: string,
    location: SearchResult,
}

const library = ["places"] as Libraries;
export function GooglePlace({ children } : { children: React.ReactNode }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
        libraries: library,
    })

    return isLoaded ? <PlacesAutoCompleteModal >{ children}</PlacesAutoCompleteModal> : null;
}

export function PlacesAutoCompleteModal({ children } : { children: React.ReactNode }) {
    const [ searchResult, setSearchResult ] = React.useState<SearchResult | null>();
    const { onClose, isOpen, onOpen } = useDisclosure();

    return (
        <React.Fragment>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal
                size={'lg'}
                onClose={() => {
                    setSearchResult(null);
                    onClose();
                }}
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay/>
                <ModalContent minH={'80vh'} borderRadius={'16px'} padding={"0px 0px 0px 0px"} overflow={'hidden'}>
                    <ModalCloseButton
                        onClick={() => onClose()}
                        style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}}
                    />
                    <ModalBody padding={"0px 0px 0px 0px"}>
                        <div className="flex flex-col justify-center items-center w-full gap-5">
                            { !searchResult ? (
                                    <div className="w-full mt-16">
                                        <p className="text-center mb-2 text-xl font-semibold">Choose an address</p>
                                        <GoogleAutocomplete setSearchResult={setSearchResult}/>
                                    </div>
                                ): <LocationForm searchResult={searchResult}
                                    handleFormCancel={() => setSearchResult(null) }
                                    handleModalClose={() => onClose() }/>
                            }
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </React.Fragment>
    )
}

type PlacesSuggestionProps = {
    results: Array<google.maps.places.AutocompletePrediction>,
    onSelect: (t:string) => void,
}

const PlacesSuggestions = React.forwardRef(function SearchSuggestion({ results, onSelect } : PlacesSuggestionProps, ref) {
    function handleClick(address: string) { onSelect(address) }

    function formatAddress(_address: string) {
        const comaIdx = _address.indexOf(',');
        const address = _address.slice(0, comaIdx)
        const postalCode = _address.slice(comaIdx+2);
        return [ address, postalCode ];
    }

    return (
        <ul tabIndex={1} ref={ref as LegacyRef<HTMLUListElement> | undefined} className="p-3 bg-white z-100 opacity-100 shadow-custom rounded-md overflow-y-scroll mt-1">
            {
                results?.map(({ place_id, description}) => {
                    const [ address, postalCode ] = formatAddress(description);
                    return (
                        <li className="group rounded-lg flex hover:bg-gray-100 py-3 cursor-pointer"
                            key={ place_id }
                            onClick={() => handleClick(description)}
                        >
                            <div className="relative flex pl-3 text-[16px] font-medium items-center w-full">
                                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center">
                                    <CustomMarker width={20} height={20}/>
                                </div>
                                <div className="ml-8">
                                    <p className="font-semibold group-hover:text-defaultGreen">{ address }</p>
                                    <p className="text-[14px] text-gray-500">{ postalCode }</p>
                                </div>
                            </div>
                        </li>
                    )
                })
            }
            <li className="w-full text-gray-400 flex justify-end items-center gap-1 mt-2">
                powered by<GoogleLogo className="h-5 mt-1"/>
            </li>
        </ul>
    )
})

type GoogleAutocompleteProps = {
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResult | null | undefined>> | ((r: SearchResult) => void),
    iconStyle?: string,
    inputStyle?: string,
    containerStyle?: string
}

export function GoogleAutocomplete({ setSearchResult, iconStyle, containerStyle, inputStyle } : GoogleAutocompleteProps) {
    const suggestionRef = React.useRef<HTMLUListElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

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

    useRelativeResize(inputRef as MutableRefObject<HTMLElement | null>, suggestionRef);

    React.useEffect(() => {
        (inputRef as React.MutableRefObject<HTMLInputElement> | undefined)?.current?.focus();
    })

    return (
        <div className={clsx(containerStyle, {
            "px-3 w-full relative h-14": !containerStyle
        })}>
            <div className={clsx(iconStyle, {
               "absolute top-1/2 -translate-y-1/2 left-5" : !iconStyle
            })}>
                <CustomMarker fill="#96999e" width={20} height={20} />
            </div>
            <input
                autoFocus
                ref={inputRef as LegacyRef<HTMLInputElement> | undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={(e) => setValue(e.target.value)}
                disabled={!ready}
                placeholder="Enter your address"
                className={clsx(inputStyle, {
                    "hover:border-black hover:border-2 focus:border-black focus:border-2 py-2 pl-8 bg-gray-100 border-2 w-full h-full rounded-lg outline-none placeholder-gray-500": !inputStyle
                })}
                autoComplete="off" />
            { status === 'OK' ? <PlacesSuggestions ref={suggestionRef} results={data} onSelect={handleSelect}/> : null }
        </div>
    )
}

type LocationFormProps = {
    searchResult: SearchResult,
    handleFormCancel: () => void,
    handleModalClose: () => void,
}

function LocationForm({ searchResult, handleFormCancel, handleModalClose } : LocationFormProps) {
    return (
        <div className="w-full">
            <div className="h-64">
                <MapBoxMap key={searchResult?.lat} latitude={searchResult?.lat} longitude={searchResult?.lng}/>
            </div>
            <AddressForm
                searchResult={searchResult}
                cancel={() => handleFormCancel()}
                close={() => handleModalClose()}
            />
        </div>
    )
}
