"use client";
import { Box } from "@mui/material";

interface MapViewerProps {
  lat: number;
  lng: number;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapViewer({ lat, lng }: MapViewerProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return <p>Error: Google Maps API key is missing.</p>;
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${lat},${lng}&zoom=16&maptype=roadmap`;

  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 2,
      }}
    >
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      />
    </Box>
  );
}
