"use client";

import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("../../../components/mapviewer"), {
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
  authority: string;
  description: string;
  fileUrl?: string;
}

export default function AlertTablePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/get-report");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const responseJson: { reports: Report[] } = await response.json();
        setReports(responseJson.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
  
    fetchReports();
  }, []);
  

  const handleViewOnMap = (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setOpen(true);
  };

  const getSeverityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "error";
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box p={3} sx={{mt: 8}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Issue Type</TableCell>
            <TableCell>Zone</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Authority</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Attachment</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} sx={{ height: "40px" }}>
              <TableCell>{report.issueType}</TableCell>
              <TableCell>{report.zone}</TableCell>
              <TableCell>
  {new Date(report.timestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</TableCell>


              <TableCell>
                <Chip
                  sx={{ mt: 2, p: 0 }}
                  label={report.priority}
                  color={getSeverityColor(report.priority)}
                />
              </TableCell>

              <TableCell>{report.authority}</TableCell>
              <TableCell>{report.description}</TableCell>
              <TableCell>
                {report.fileUrl ? (
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleViewOnMap(
                      report.coordinates.lat,
                      report.coordinates.lng
                    )
                  }
                >
                  View on Map
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Location on Map</DialogTitle>
        <DialogContent>
          {selectedCoords && (
            <MapViewer lat={selectedCoords.lat} lng={selectedCoords.lng} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
