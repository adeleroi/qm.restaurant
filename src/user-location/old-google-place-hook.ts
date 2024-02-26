import React from 'react';

export type LocationType = {
    lat: number,
    lng: number,
    shortAddress: string,
    postalCode: string,
}

export type LocationErrorType = {
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
                if (!place.geometry || !place.geometry?.location) {
                    setLocationError({msg: "We're having trouble finding this address. Please choose another one."});
                } else {
                    setLocation({lat, lng, shortAddress, postalCode});
                    setLocationError(null);
                }
            })
        }
        initAutocomplete();

    }, [searchInputRef]); // useless dependency but useful for the linter to stop yelling at me! :-)

    return { location, setLocation, locationError };
}
