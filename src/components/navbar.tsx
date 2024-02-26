import { Button } from "./button";
import { Logo } from "./logo";
import { Search } from "./search";
import { useLoginFormAction } from "../context/hooks";
import { AuthFormTrigger } from "./auth-form";
import { Menu } from "./menu";
import { CarTriggerForCheckout, CartIcon } from "./cart/cart";
import { useFirebaseAuth } from "../firebase/auth";
import { Form, useLocation } from "react-router-dom";
import clsx from "clsx";
import React from "react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    useDisclosure,
  } from '@chakra-ui/react';
import { MapBoxMap } from "./store-info/map-mapbox";
import { Field } from "./form-element";

const regex = /[a-z]+/i;

type LocationType = {
    lat: number,
    lng: number,
    shortAddress: string,
    postalCode: string,
}

type LocationErrorType = {
    msg: string,
}

export function useBasicGooglePlace(searchInputRef: React.MutableRefObject<HTMLInputElement | null>) {
    const [ location, setLocation ] = React.useState<LocationType | null>(null);
    const [ locationError, setLocationError ] = React.useState<LocationErrorType | null>(null);
    React.useEffect(() => {
        const input = searchInputRef.current;
        if (!input) return;

        let autocomplete: google.maps.places.Autocomplete;
        function initAutocomplete() {
            autocomplete = new google.maps.places.Autocomplete(
                input as HTMLInputElement,
                {
                    types: ["address"],
                    componentRestrictions: { country: ["CA"] },
                    fields: ['name', 'address_components', 'geometry']
                }
            )

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                const lat = place.geometry?.location?.lat() as number;
                const lng = place.geometry?.location?.lng() as number;
                const shortAddress = place.name as string;
                const postalCode = place.address_components?.[8]?.short_name as string || "";
                console.log(lat, lng, place);
                if (!place.geometry || !place.geometry?.location) {
                    setLocationError({msg: "We're having trouble finding this address. Please choose another one."});
                } else {
                    setLocation({lat, lng, shortAddress, postalCode});
                    locationError && setLocationError(null);
                }
            })
        }
        initAutocomplete();

    }, [searchInputRef]); // this dependency is naturally not usefull but did that for the linter to stop complaining;

    return { location, setLocation, locationError };
}

export function Navbar() {
    const { loggedIn } = useFirebaseAuth();
    const currLocation = useLocation();
    const location: string | undefined = currLocation.pathname.match(regex)?.[0];

    return (
        <nav className="flex justify-between w-full py-2 px-16 items-center bg-white border-b-[1px] border-gray-200 gap-2 top-0 z-40 sticky">
            <div className="mr-8 flex items-center justify-start gap-4">
                { loggedIn ? <Menu/> : null }
                <Logo/>
            </div>
            <div className={clsx("w-full flex-1 justify-center px-4", { "hidden": !loggedIn })}>
                <Search searchType={location}/>
            </div>
            <AddressPopover address="75 Daly Ave" />
            <div className="ml-8">
                <ButtonSection/>
            </div>
        </nav>
    )
}

export function AddressPopover({ address } : { address?: string }) {
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const { location, setLocation, locationError } = useBasicGooglePlace(searchInputRef);
    const { onClose, isOpen, onOpen } = useDisclosure();

    function handleClose() {
        setLocation(null);
        onClose();
    }

    return (
        <Popover
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            closeOnBlur={false}
            initialFocusRef={searchInputRef}>
            <PopoverTrigger>
                <button className="w-36 cursor-pointer border-2 border-black text-lg font-bold text-black px-1 h-12 rounded-3xl flex gap-2 items-center justify-center">
                    <span className="material-symbols-outlined font-black text-lg">location_on</span>
                    <p className="text-[15px] truncate text-black">{ address }</p>
                </button>
            </PopoverTrigger>
            <PopoverContent minW={'30rem'} minH={'70vh'} border={''} boxShadow={"-14px 16px 52px 8px rgb(0 0 0 / 0.25)"}>
                <PopoverArrow/>
                <PopoverCloseButton
                    onClick={() => handleClose()}
                    style={{top: '1rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}} />
                <PopoverHeader border={'none'}>
                    <h1 className="text-2xl pt-2 font-semibold">
                        {
                            location ? location.shortAddress : "Enter your address"
                        }
                    </h1>
                </PopoverHeader>
                <PopoverBody>
                     {
                        location ?
                            <div>
                                <div className="h-44">
                                    <MapBoxMap key={location?.lat} latitude={location?.lat} longitude={location?.lng}/>
                                </div>
                                <AddressForm location={location}/>
                            </div>
                            : (
                                <div className="w-full">
                                    <input
                                        ref={searchInputRef}
                                        placeholder="Add a new address"
                                        className={clsx("placeholder:font-semibold placeholder:text-gray-600 rounded-lg w-full p-3  bg-gray-100 outline-none", {
                                            "focus:border-black focus:border-2": !locationError?.msg,
                                            "border-2 border-red-500": locationError?.msg
                                        })} />
                                    <span className="text-red-500 text-[13px] font-semibold">{ locationError?.msg ? locationError?.msg : null }</span>
                                </div>
                            )
                     }
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

function AddressForm({ location } : { location: LocationType }) {
    return (
        <div className="z-40">
            <Form>
                <Field className="mt-3">
                    <label>Address:</label>
                    <input
                        defaultValue={location.shortAddress}
                        className="p-2 mt-[2px] bg-gray-100 focus:border-black outline-none focus:border-2 w-full rounded-lg"/>
                </Field>
                <Field className="mt-3">
                    <label>Appartment, suite:</label>
                    <input className="p-2 mt-[2px] bg-gray-100 focus:border-black outline-none focus:border-2 w-full rounded-lg"/>
                </Field>
                <Field className="mt-3">
                    <label>Postal code:</label>
                    <input
                        defaultValue={location.postalCode}
                        className="p-2 mt-[2px] bg-gray-100 focus:border-black outline-none focus:border-2 w-full rounded-lg"/>
                </Field>
                <div className="w-full flex justify-end gap-4 mt-16 pb-4">
                    <button type="button" className="w-32 rounded-lg p-2 text-black border-[2px] border-black hover:bg-gray-100 font-bold">Cancel</button>
                    <button type="submit" className="w-32 rounded-lg p-2 text-white bg-defaultGreen hover:bg-green-800 font-bold">Save</button>
                </div>
            </Form>
        </div>
    )
}

function ButtonSection() {
    const { setAction } = useLoginFormAction();
    const { loading, complete, data: user }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth();

    if (loading) return null;

    if (complete && user) {
        return (
            <>
                <CarTriggerForCheckout triggerElement={
                    <button className="group/cartbtn py-2 pr-4 pl-3 max-w-[80px] rounded-3xl shadow-custom bg-defaultGreen hover:bg-green-800 hover:shadow-custom text-black relative">
                        <CartIcon/>
                    </button>
                }/>
            </>
        )
    }
    return (
        <div className="flex w-80 gap-2 items-center justify-end">
            <AuthFormTrigger
                triggerElement={
                    <Button size="small" onClick={() => setAction('login')} className="h-8 shadow-custom bg-white hover:bg-gray-100 focus:bg-gray-200 text-black">
                        Log in
                    </Button>
                }
            />
            <AuthFormTrigger
                triggerElement={
                    <Button size="small" onClick={() => setAction('signup')} className="h-8 border-none shadow-custom hover:bg-gray-800 focus:bg-gray-700 bg-black text-white">
                        Sign up
                    </Button>
                }
            />
        </div>
    )
}
