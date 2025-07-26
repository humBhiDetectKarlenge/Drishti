"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { GoogleMap, HeatmapLayer, Marker } from "@react-google-maps/api";
import { useMap } from "./MapProvider";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface UserData {
  userType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const center = { lat: 13.0626509, lng: 77.4761126 };

const ROLE_OPTIONS = ["crowd", "doctor", "police", "help", "security"];

const ROLE_COLORS: Record<string, string> = {
  doctor: "blue",
  police: "black",
  help: "green",
  security: "red",
};

const HeatmapMap = () => {
  const { isLoaded } = useMap();
  const [users, setUsers] = useState<UserData[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const result: UserData[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (
            ROLE_OPTIONS.includes(data.userType?.toLowerCase()) &&
            typeof data.coordinates?.lat === "number" &&
            typeof data.coordinates?.lng === "number"
          ) {
            result.push({
              userType: data.userType.toLowerCase(),
              coordinates: data.coordinates,
            });
          }
        });

        setUsers(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const heatmapData = useMemo(
    () =>
      users
        .filter((user) => user.userType === "crowd")
        .map(
          (user) =>
            new window.google.maps.LatLng(
              user.coordinates.lat,
              user.coordinates.lng
            )
        ),
    [users]
  );

  const markerUsers = users.filter((user) => user.userType !== "crowd");

  useEffect(() => {
    if (!mapRef.current || users.length === 0 || !window.google?.maps?.LatLngBounds) return;
  
    const bounds = new window.google.maps.LatLngBounds();
  
    users.forEach((user) => {
      bounds.extend(
        new window.google.maps.LatLng(user.coordinates.lat, user.coordinates.lng)
      );
    });
  
    mapRef.current.fitBounds(bounds);
  }, [users]);
  
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map: google.maps.Map) => {
          mapRef.current = map;
        }}      >
        {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}

        {markerUsers.map((user, idx) => (
          <Marker
            key={idx}
            position={user.coordinates}
          
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: ROLE_COLORS[user.userType] || "gray",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "white",
            }}
          />
        
        ))}
      </GoogleMap>

      
       <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          fontSize: "14px",
          zIndex: 100,
        }}
      >
        <strong>Legend:</strong>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {Object.entries(ROLE_COLORS).map(([role, label]) => (
            <li key={role}>📍 {label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default HeatmapMap;
