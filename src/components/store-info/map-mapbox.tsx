import Map, { Marker } from 'react-map-gl';
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
            reuseMaps
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
                <Marker
                    longitude={longitude}
                    latitude={latitude}>
                        <IconMarker bg='#ef4444' />
                </Marker>
        </Map>
    )
}

type IconMarkerProps = {
    className?: string,
    circleColor?: string,
    bg?: string,
    hideShadow?: boolean,
}

export function IconMarker({ className, circleColor="#fff", bg="#099500", hideShadow=false } : IconMarkerProps) {
    return (
        <svg className={className} id="marker" data-name="marker" xmlns="http://www.w3.org/2000/svg" width="25" height="50" viewBox="0 0 20 48">
            <g id="mapbox-marker-icon">
                <g id="icon">
                <ellipse id="shadow" cx="10" cy="27" rx="9" ry="5" fill={ !hideShadow ? "#c4c4c4" : "#fff" } opacity="0.3" style={{"isolation": "isolate"}}/>
                <g id="mask" opacity="0.3">
                    <g id="group">
                    <path id="shadow-2" data-name="shadow" fill={ !hideShadow ? "#000" : "#fff"}  d="M10,32c5,0,9-2.2,9-5s-4-5-9-5-9,2.2-9,5S5,32,10,32Z" fill-rule="evenodd"/>
                    </g>
                </g>
                <path id="color" fill={bg} stroke="#269561" stroke-width="0.5" d="M19.25,10.4a13.0663,13.0663,0,0,1-1.4607,5.2235,41.5281,41.5281,0,0,1-3.2459,5.5483c-1.1829,1.7369-2.3662,3.2784-3.2541,4.3859-.4438.5536-.8135.9984-1.0721,1.3046-.0844.1-.157.1852-.2164.2545-.06-.07-.1325-.1564-.2173-.2578-.2587-.3088-.6284-.7571-1.0723-1.3147-.8879-1.1154-2.0714-2.6664-3.2543-4.41a42.2677,42.2677,0,0,1-3.2463-5.5535A12.978,12.978,0,0,1,.75,10.4,9.4659,9.4659,0,0,1,10,.75,9.4659,9.4659,0,0,1,19.25,10.4Z"/>
                <path id="circle" fill={circleColor} stroke="#269561" stroke-width="0.5" d="M13.55,10A3.55,3.55,0,1,1,10,6.45,3.5484,3.5484,0,0,1,13.55,10Z"/>
                </g>
            </g>
            <rect width="20" height="20" fill="none"/>
        </svg>

    )
}
