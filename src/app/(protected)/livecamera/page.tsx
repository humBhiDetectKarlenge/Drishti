"use client";
import { Box } from "@mui/material";
import Cam1 from "../../../../public/cam1.jpeg";
import Cam2 from "../../../../public/cam2.jpeg";
import Cam3 from "../../../../public/cam3.jpeg";
import Cam4 from "../../../../public/cam4.jpeg";
import Image from "next/image";

export default function LiveCamera() {
  const cameras = [Cam1, Cam2, Cam3, Cam4];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gridTemplateRows: { xs: "repeat(4, 1fr)", sm: "1fr 1fr" },
        width: "100%",
        height: "calc(100vh - 64px)", 
        mt: "64px",
      }}
    >
      {cameras.map((cam, index) => (
        <Box
          key={index}
          sx={{
            border: "2px solid white",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={cam}
            alt={`Camera ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      ))}
    </Box>
  );
}
