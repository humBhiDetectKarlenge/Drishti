'use client';
import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const MapContext = createContext<{ isLoaded: boolean }>({ isLoaded: false });

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['visualization'];

export const useMap = () => useContext(MapContext);

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC35LxjKEAEMR_z6KppbcMv7_v_VqcK2I0",
    libraries,
  });

  return (
    <MapContext.Provider value={{ isLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
