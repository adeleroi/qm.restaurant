type LatLong = {latitude: number, longitude: number};

export async function getDistane(storeLocation: LatLong, userLocation?: LatLong) {
    if (!userLocation) {
        userLocation = await getUserLocation() as unknown as LatLong;
        console.log('userLocation', userLocation);
        if (!userLocation) {
            window.navigator.geolocation.getCurrentPosition(position => {
                userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude } as unknown as LatLong
            })
        }
    }

    const { latitude: lat1, longitude: lon1 } = storeLocation;
    const { latitude: lat2, longitude: lon2 } = userLocation;
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?destination=${lat1},${lon1}&origin=${lat2},${lon2}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,);
    const routes = await response.json();
    console.log('routes', routes);
    return 5;
}

export async function getUserLocation() {
    let position = {latitude:45.41999816894531 , longitude: -75.70999908447266};
    await (await fetch('https://ipapi.co/json')).json()
    .then(ipInfos => {
        position = { latitude: ipInfos.latitude, longitude: ipInfos.longitude };
    })
    .catch(err => console.error(err));
    return position
}