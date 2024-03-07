import { Libraries, useLoadScript } from "@react-google-maps/api";
import React, { LegacyRef } from "react";
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
    Radio,
    RadioGroup,
  } from '@chakra-ui/react';
import { MapBoxMap } from "../components/store-info/map-mapbox";
import { AddressForm } from "./location-form";
import { Trigger } from "../utils/trigger";
import { CustomMarker, GoogleLogo } from "../components/icons/icon";
import clsx from "clsx";
import { useFetcher, useRouteLoaderData } from "react-router-dom";

export type LatLng = { lat: number, lng: number };

export type SearchResult = LatLng & {
    id?: string,
    postalCode: string | undefined,
    address: string | undefined,
    deliveryInstruction?: string,
    appNumber?: string,
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
    const [ locationFormContext, setLocationFormContext ] = React.useState<'edit' | 'add'>('add');
    const { onClose, isOpen, onOpen } = useDisclosure();
    const data = useRouteLoaderData('root') as { addresses: Array<SearchResult>};

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
                scrollBehavior="inside"
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
                                    <div className="w-full px-3">
                                        <div className="w-full mt-16 mb-4">
                                            <p className="text-center mb-2 text-xl font-semibold">Choose an address</p>
                                            <GoogleAutocomplete
                                                setLocationFormContext={setLocationFormContext}
                                                containerStyle="w-full relative h-14"
                                                iconStyle="absolute top-1/2 -translate-y-1/2 left-2"
                                                setSearchResult={setSearchResult}/>
                                        </div>
                                        <SelectableAddressList
                                            closeModal={onClose}
                                            addressList={data?.addresses}
                                            setLocationFormContext={setLocationFormContext}
                                            setAddressToEdit={setSearchResult}/>
                                    </div>
                                ): <LocationForm searchResult={searchResult}
                                        handleFormCancel={() => setSearchResult(null)}
                                        handleModalClose={() => {
                                            onClose();
                                            setSearchResult(null);
                                        }}
                                        context={locationFormContext}
                                    />
                            }
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </React.Fragment>
    )
}

function formatAddress(_address: string) {
    const comaIdx = _address.indexOf(',');
    const address = _address.slice(0, comaIdx)
    const postalCode = _address.slice(comaIdx+2);
    return [ address, postalCode ];
}
type SelectableAddressListProps = {
    addressList: Array<SearchResult>,
    setAddressToEdit: React.Dispatch<React.SetStateAction<SearchResult | null | undefined>>,
    closeModal: () => void,
    setLocationFormContext: React.Dispatch<React.SetStateAction<'edit' | 'add'>>
}

function SelectableAddressList({ addressList, setAddressToEdit, closeModal, setLocationFormContext } : SelectableAddressListProps) {
    const fetcher = useFetcher();

    const isSubmitting = fetcher.state !== 'idle';

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData((e.target as HTMLInputElement).closest('form') as HTMLFormElement);
        formData.append('intent', 'set_main_delivery_address');
        fetcher.submit(formData, { method: 'post', action: "/", encType: "multipart/form-data" });
        closeModal();
    }

    function handleEdit(address: SearchResult) {
        setAddressToEdit(address);
        setLocationFormContext('edit');
    }

    function handleDelete(addressId: string) {
        const formData = new FormData();
        formData.append('addressId', addressId);
        formData.append('intent', 'delete_delivery_address')
        fetcher.submit(formData, { method: 'post', action: "/", encType: "multipart/form-data" });
    }

    return (
        <div className="flex items-start flex-col w-full ">
        <fetcher.Form onChange={handleSubmit} className="w-full">
            <RadioGroup defaultValue={addressList[0].id}>
                {
                    addressList?.map(data => (
                        <div className="text-left text-md py-3 rounded-lg" key={data.id}>
                            <SelectableAddress
                                data={data}
                                isSubmitting={isSubmitting}
                                setAddressToEdit={handleEdit}
                                deleteAddress={handleDelete}
                            />
                        </div>
                    ))
                }
            </RadioGroup>
        </fetcher.Form>
        </div>
    )
}

type SelectableAddressProps = {
    setAddressToEdit: (t:SearchResult) => void,
    data: SearchResult,
    deleteAddress: (a:string) => void,
    isSubmitting: boolean,
}

function SelectableAddress({ data, setAddressToEdit, deleteAddress, isSubmitting } : SelectableAddressProps) {
    const [ address, postalCode ] = formatAddress(data.address as string);
    return (
        <fieldset className="flex gap-3 justify-between w-full">
            <div className="flex gap-3">
                <Radio colorScheme="green" size={'lg'} type="radio" name="addressId" id={data.id} value={data.id} className="w-5 border-2 border-black rounded-full h-5"/>
                <label className="cursor-pointer grid" htmlFor={data.id}>
                    <span className="font-semibold">{address}, </span>
                    <span className="text-gray-700 text-[13px]">{postalCode}</span>
                </label>
            </div>
            <div className="flex gap-3 items-center">
                <div onClick={() => setAddressToEdit(data)}>
                    <span className={clsx("material-symbols-outlined", {
                        "ont-semibold text-gray-900 hover:text-gray-400 cursor-pointer": !isSubmitting,
                        "text-gray-400 cursor-not-allowed": isSubmitting,
                    })}>edit</span>
                </div>
                <div onClick={() => deleteAddress(data.id as string)}>
                    <span className={clsx("material-symbols-outlined", {
                        "ont-semibold text-gray-900 hover:text-gray-400 cursor-pointer": !isSubmitting,
                        "text-gray-400 cursor-not-allowed": isSubmitting,
                    })}>delete</span>
                </div>
            </div>
        </fieldset>
    )
}

type PlacesSuggestionProps = {
    results: Array<google.maps.places.AutocompletePrediction>,
    onSelect: (t:string) => void,
}

const PlacesSuggestions = React.forwardRef(function SearchSuggestion({ results, onSelect } : PlacesSuggestionProps, ref) {
    function handleClick(address: string) { onSelect(address) }

    return (
        <ul tabIndex={1} ref={ref as LegacyRef<HTMLUListElement> | undefined} className="p-3 bg-white shadow-custom rounded-md overflow-y-scroll mt-1 absolute  w-full z-10">
            {
                results?.map(({ place_id, description}) => {
                    const [ address, postalCode ] = formatAddress(description);
                    return (
                        <li className="group rounded-lg flex hover:bg-gray-100 py-3 cursor-pointer"
                            key={ place_id }
                            onClick={() => handleClick(description)}
                        >
                            <div className="relative flex pl-3 text-[16px] font-medium items-center w-full z-">
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
    containerStyle?: string,
    setLocationFormContext?: React.Dispatch<React.SetStateAction<"edit" | "add">>,
}

export function GoogleAutocomplete({ setSearchResult, iconStyle, containerStyle, inputStyle, setLocationFormContext } : GoogleAutocompleteProps) {
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
        setSearchResult({ lat, lng, postalCode, address  });
        setLocationFormContext?.('add');
    }

    React.useEffect(() => {
        (inputRef as React.MutableRefObject<HTMLInputElement> | undefined)?.current?.focus();
    })

    return (
        <div className={clsx(containerStyle, {
            "w-full relative h-14": !containerStyle
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
    context: 'edit' | 'add',
}

function LocationForm({ searchResult, handleFormCancel, handleModalClose, context } : LocationFormProps) {
    const title = context === 'edit' ? 'Edit address' : 'Add new address';
    return (
        <div className="w-full">
            <div className="py-4 pl-3">
                <h1 className="font-bold text-xl capitalize">{ title }</h1>
            </div>
            <div className="h-64">
                <MapBoxMap key={searchResult?.lat} latitude={searchResult?.lat} longitude={searchResult?.lng}/>
            </div>
            <AddressForm
                searchResult={searchResult}
                cancel={() => handleFormCancel()}
                close={() => handleModalClose()}
                context={context}
            />
        </div>
    )
}
