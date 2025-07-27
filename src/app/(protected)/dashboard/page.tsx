"use client";

import dynamic from "next/dynamic";
import { useAuth } from "../../../components/AuthProvider";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import EmergencyControls from "@/components/EmergencyControls";
import TopAlerts from "@/components/TopAlerts";
import ZoneManagement from "@/components/ZoneManagement";
import NotificationDialogLauncher from "@/components/NotificationDialogLauncher";

const HeatmapMap = dynamic(() => import("@/components/HeatmapMap"), {
  ssr: false,
});

type RoleCounts = {
  [key: string]: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState<RoleCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roleDisplayMap: Record<
    string,
    { label: string; match: string; color: string }
  > = {
    crowd: { label: "Total Attendees", match: "crowd", color: "#e3f2fd" },
    police: { label: "On-Field Patrol", match: "police", color: "#fff3e0" },
    doctor: { label: "Medical Responders", match: "doctor", color: "#e8f5e9" },
    help: { label: "Emergency Responders", match: "help", color: "#fce4ec" },
    security: { label: "Field Guards", match: "security", color: "#ede7f6" },
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/authority-count");
        const data = await res.json();

        if (data.success) {
          setCounts(data.data);
        } else {
          setError(data.message || "Failed to fetch counts");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Unexpected error");
        }
      }
    };

    fetchCounts();
  }, []);

  {console.log(JSON.stringify(counts))}

  if (!user)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          People Stats
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 4,
          }}
        >
         

          {counts &&
            [
              ...Object.entries(counts).map(([role, count]) => ({
                label: roleDisplayMap[role]?.label,
                value: count,
                color: roleDisplayMap[role]?.color,
              })),
            ].map((item) => (
              <Paper
                key={item.label}
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: item.color,
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5">{item.value}</Typography>
                <Typography variant="body2">{item.label}</Typography>
              </Paper>
            ))}
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Zone Status
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {[
            {
              label: "West Gate",
              value: "4200 / 5000",
              density: "80%",
              color: "red",
            },
            {
              label: "VIP Area",
              value: "4200 / 5000",
              density: "80%",
              color: "red",
            },
            {
              label: "Main Stage",
              value: "4200 / 5000",
              density: "80%",
              color: "red",
            },
            {
              label: "Exit Gate",
              value: "4200 / 5000",
              density: "60%",
              color: "yellow",
            },
            {
              label: "Dinner Place",
              value: "4200 / 5000",
              density: "80%",
              color: "red",
            },
            {
              label: "Parking",
              value: "420 / 5000",
              density: "20%",
              color: "green",
            },
          ].map((zone) => (
            <Paper
              key={zone.label}
              sx={{ p: 2, flex: "1 1 30%", bgcolor: "#f5f5f5" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1">{zone.label}</Typography>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor:
                      zone.color === "red"
                        ? "error.main"
                        : zone.color === "yellow"
                        ? "warning.main"
                        : "success.main",
                  }}
                />
              </Box>
              <Typography variant="body2">
                {zone.value} • {zone.density} Density
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
      
      <Paper sx={{ display: "flex", gap: 2, backgroundColor: "transparent" }}>
        <Paper sx={{ p: 2, flex: 2 }}>
          <HeatmapMap />
        </Paper>

        <Paper sx={{ p: 2, flex: 1 }}>
          <TopAlerts />
        </Paper>
      </Paper>
      {/* <Paper sx={{ p: 2 }}>
        {" "}
        <EmergencyControls />{" "}
      </Paper>{" "}
      <Paper sx={{ p: 2 }}>
        {" "}
        <ZoneManagement />{" "}
      </Paper> */}
    </Box>
  );
}
