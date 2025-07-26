"use client";

import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("../components/mapviewer"), {
  ssr: false,
});

interface Report {
  id: string;
  timestamp: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  issueType: string;
  priority: string;
  userType: string;
  description: string;
  fileUrl?: string;
}

export default function TopPriorityAlertsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPriorityReports = async () => {
      try {
        const response = await fetch("/api/get-report");
        if (!response.ok) throw new Error("Failed to fetch reports");

        const data: { reports: Report[] } = await response.json();

        const highPriority = data.reports
          .filter(
            (r) =>
              r.priority.toLowerCase() === "high" ||
              r.priority.toLowerCase() === "critical"
          )
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )
          .slice(0, 3);

        setReports(highPriority);
      } catch (err) {
        console.error("Error fetching top priority reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPriorityReports();
  }, []);

  const getSeverityColor = (
    priority: string
  ): "error" | "warning" | "default" => {
    const p = priority.toLowerCase();
    return p === "critical" || p === "high"
      ? "error"
      : p === "medium"
      ? "warning"
      : "default";
  };

  const handleViewOnMap = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Top Priority Alerts
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : reports.length === 0 ? (
        <Typography>No high priority alerts found.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Issue</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.issueType}</TableCell>
                <TableCell>{r.zone}</TableCell>
                <TableCell>
                  {new Date(r.timestamp).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={r.priority}
                    size="small"
                    color={getSeverityColor(r.priority)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleViewOnMap(r.coordinates.lat, r.coordinates.lng)
                    }
                    variant="outlined"
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Alert Location</DialogTitle>
        <DialogContent>
          {selectedCoords && (
            <MapViewer lat={selectedCoords.lat} lng={selectedCoords.lng} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
