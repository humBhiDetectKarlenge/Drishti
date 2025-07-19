"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Grid,
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

  const handleSubmit = async () => {
    setStatus(null);
    try {
      const res = await fetch("/api/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Report submitted successfully.");
      } else {
        setStatus(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting report.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Submit Security Report
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Zone"
            name="zone"
            fullWidth
            value={form.zone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Latitude"
            name="lat"
            fullWidth
            value={form.coordinates.lat}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Longitude"
            name="lng"
            fullWidth
            value={form.coordinates.lng}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            fullWidth
            value={form.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Grid>
        {status && (
          <Grid item xs={12}>
            <Typography>{status}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
