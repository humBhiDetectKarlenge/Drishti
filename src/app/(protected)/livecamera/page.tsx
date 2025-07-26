"use client";
import { Box } from "@mui/material";

export default function LiveCamera() {
  return (
    // <Box
    //   sx={{
    //     height: "100%",
    //     weight: "100%",
    //     display: "flex",
    //     flexDirection: "column",
    //   }}
    // >
    //   <Box
    //     sx={{
    //       height: "50%",
    //       weight: "100%",
    //       // display: "flex",
    //       // flexDirection: "row",
    //     }}
    //   >
    //     <Box sx={{ height: "50%", weight: "50%", bgcolor: "red" }}></Box>
    //     <Box sx={{ height: "50%", weight: "50%", bgcolor: "green" }}> </Box>
    //   </Box>
    //   <Box
    //     sx={{
    //       height: "50%",
    //       weight: "100%",
    //       display: "flex",
    //       flexDirection: "row",
    //     }}
    //   >
    //     <Box sx={{ height: "50%", weight: "50%", bgcolor: "blue" }}></Box>
    //     <Box sx={{ height: "50%", weight: "50%", bgcolor: "yellow" }}></Box>
    //   </Box>
    // </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        width: "100%",
        height: "100%",
        mt: "44px",
      }}
    >
      <Box sx={{ bgcolor: "red", border: "1px solid white" }}>
        <iframe src="https://192.168.137.169:8080/" style={{height:'100%', width:'100%'}}></iframe>
      </Box>
      <Box sx={{ bgcolor: "blue", border: "1px solid white" }}>
        <iframe src="https://192.168.137.169:8080/" style={{height:'100%', width:'100%'}}></iframe>
      </Box>
      <Box sx={{ bgcolor: "green", border: "1px solid white" }}>
        <iframe src="https://192.168.137.169:8080/" style={{height:'100%', width:'100%'}}></iframe>
      </Box>
      <Box sx={{ bgcolor: "yellow", border: "1px solid white" }}> 
      <iframe src="https://192.168.137.169:8080/" style={{height:'100%', width:'100%'}}></iframe>
      </Box>
    </Box>
  );
}
