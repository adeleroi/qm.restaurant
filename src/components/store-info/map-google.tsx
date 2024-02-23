import {APIProvider, Map, AdvancedMarker as Marker} from '@vis.gl/react-google-maps';

export function StoreMap() {
  const position = { lat: 45.414430, lng: -75.649230 };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <Map
        center={position}
        zoom={12}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID_VECTOR}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}
