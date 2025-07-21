"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const issueTypes = [
  "suspicious object",
  "crowding",
  "aggression",
  "VIP breach",
  "lost item",
];

const priorityLevels = ["Low", "Medium", "High", "Critical"];

export default function SecurityPage() {
  const [form, setForm] = useState({
    timestamp: new Date().toISOString(),
    zone: "",
    coordinates: { lat: "", lng: "" },
    issueType: "",
    priority: "",
    uuid: crypto.randomUUID(),
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<null | string>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setForm((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("zone", form.zone);
    formData.append("lat", String(form.coordinates.lat));
    formData.append("lng", String(form.coordinates.lng));
    formData.append("issueType", form.issueType);
    formData.append("priority", form.priority);
    formData.append("uuid", form.uuid);
    formData.append("authority", "Security"); //userType
    formData.append("description", form.description);
    formData.append("timestamp", form.timestamp);

    try {
      const res = await fetch("/api/submit-report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Report submitted successfully!");
        setForm({
          timestamp: new Date().toISOString(),
          zone: "",
          coordinates: { lat: "", lng: "" },
          issueType: "",
          priority: "",
          uuid: crypto.randomUUID(),
          description: "",
        });
        setSelectedFile(null);
      } else {
        setStatus(`${data.error || "Submission failed."}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting report.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Submit Security Report
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Zone"
            name="zone"
            fullWidth
            value={form.zone}
            onChange={handleChange}
          />
          <TextField
            label="Latitude"
            name="lat"
            fullWidth
            value={form.coordinates.lat}
            onChange={handleChange}
          />
          <TextField
            label="Longitude"
            name="lng"
            fullWidth
            value={form.coordinates.lng}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            label="Nature of Issue"
            name="issueType"
            fullWidth
            value={form.issueType}
            onChange={handleChange}
          >
            {issueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            name="priority"
            fullWidth
            value={form.priority}
            onChange={handleChange}
          >
            {priorityLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Description"
          name="description"
          multiline
          rows={4}
          fullWidth
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <Button variant="contained" type="submit">
          Submit Report
        </Button>

        {status && (
          <Typography sx={{ mt: 2 }} color={status.startsWith("Report") ? "green" : "error"}>
            {status}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
