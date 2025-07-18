import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function HeaderClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); 
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Typography variant="h5">
      <strong>Drishti</strong> &nbsp; {formattedTime}
    </Typography>
  );
}
