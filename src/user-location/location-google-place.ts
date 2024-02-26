// useful links:
// Main: https://developers.google.com/maps/documentation/javascript/place-autocomplete?hl=fr
// place autocomplete: https://developers.google.com/maps/documentation/places/web-service/autocomplete?hl=fr&_gl=1*yvelid*_up*MQ..*_ga*OTkxODI4NTg3LjE3MDg4OTM0ODY.*_ga_NRWSTWS78N*MTcwODg5MzQ4Ni4xLjAuMTcwODg5MzQ4Ni4wLjAuMA..
// maps interface: https://developers.google.com/maps/documentation/javascript/reference/top-level?hl=fr&_gl=1*15uu7s3*_up*MQ..*_ga*NzUxMTk5MjM1LjE3MDg4ODkyMTk.*_ga_NRWSTWS78N*MTcwODg4OTIxOS4xLjAuMTcwODg4OTIxOS4wLjAuMA..#PlacesLibrary
// google logo: https://developers.google.com/maps/documentation/places/web-service/policies?hl=fr&_gl=1*yvelid*_up*MQ..*_ga*OTkxODI4NTg3LjE3MDg4OTM0ODY.*_ga_NRWSTWS78N*MTcwODg5MzQ4Ni4xLjAuMTcwODg5MzQ4Ni4wLjAuMA..#logo
// types: https://developers.google.com/maps/documentation/javascript/supported_types?hl=fr&_gl=1*7vo51x*_up*MQ..*_ga*Mjg4MjAuMTcwODg5MjIxMw..*_ga_NRWSTWS78N*MTcwODg5MjIxMy4xLjAuMTcwODg5MjIxMy4wLjAuMA..

const sessionToken = new google.maps.places.AutocompleteSessionToken()
export function getPlaces(input: string) {
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({
            input,
            sessionToken,
            locationBias: "",
            types: ["address"],
            componentRestrictions: { country: "CA" },
        },
        (preds, _status) => {
            console.log(preds);
            console.log(_status);
        });
}
