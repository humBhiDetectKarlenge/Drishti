'use client';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useMap } from './MapProvider'; 
const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function MapViewer({ lat, lng }: { lat: number; lng: number }) {
  const { isLoaded } = useMap();

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      center={{ lat, lng }}
      zoom={16}
      mapContainerStyle={containerStyle}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
