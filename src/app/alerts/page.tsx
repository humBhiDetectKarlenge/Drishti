// app/alerts/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, CircularProgress, Grid,
} from "@mui/material";

interface Report {
  id: string;
  timestamp: string;
  zone: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  nature: string;
  priority: string;
  uuid: string;
  description: string;
}


export default function AlertsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const url = "/api/get-report";
        console.log("Sending GET request to:", url);
  
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });
  
        console.log("Response status:", res.status);
        console.log("Response headers:", Array.from(res.headers.entries()));
  
        if (!res.ok) {
          const text = await res.text();
          console.error("Error response body:", text);
          throw new Error("Failed to fetch reports");
        }
  
        const data = await res.json();
        console.log("Data received:", data);
  
        setReports(data.reports);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (reports.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No reports found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" mb={2}>All Reports</Typography>
      <Grid container spacing={2}>
        {reports.map((r) => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{r.nature} - {r.priority}</Typography>
                <Typography>Zone: {r.zone}</Typography>
                <Typography>Coordinates Lat: {r.coordinates.lng}</Typography>
                <Typography>Coordinates Lgn: {r.coordinates.lat}</Typography>

                <Typography>Description: {r.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted on {new Date(r.timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
