import Map from 'react-map-gl';

const MAP_BOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN

export function StoreMapBox() {
    return (
        <Map
            attributionControl={false}
            mapboxAccessToken={MAP_BOX_ACCESS_TOKEN}
            mapLib={import('mapbox-gl')}
            initialViewState={{
                longitude: -75.649230,
                latitude: 45.414430,
                zoom: 14
            }}
            style={{width: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v11">
        </Map>
    )
}