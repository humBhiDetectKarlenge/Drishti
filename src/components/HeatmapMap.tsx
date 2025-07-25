"use client";

import { GoogleMap, HeatmapLayer } from "@react-google-maps/api";
import { useMemo } from "react";
import { useMap } from './MapProvider'; 


const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 28.6139, lng: 77.2090 };

const HeatmapMap = () => {
  const { isLoaded } = useMap();

  const heatmapData = useMemo(
    () => [
      { location: new google.maps.LatLng(28.6139, 77.209), weight: 1 },
      { location: new google.maps.LatLng(28.6149, 77.2095), weight: 1 },
    ],
    []
  );

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <HeatmapLayer data={heatmapData} />
    </GoogleMap>
  );
};

export default HeatmapMap;
