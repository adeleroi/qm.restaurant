import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"

const MAP_BOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN

type MapBoxMapProps = {
    longitude?: number,
    latitude?: number,
    zoom?: number,
}

export function MapBoxMap({ longitude=-75.649230, latitude=45.414430, zoom=14 } : MapBoxMapProps) {
    return (
        <Map
            attributionControl={false}
            mapboxAccessToken={MAP_BOX_ACCESS_TOKEN}
            mapLib={import('mapbox-gl')}
            initialViewState={{
                longitude,
                latitude,
                zoom
            }}
            style={{width: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v11">
        </Map>
    )
}