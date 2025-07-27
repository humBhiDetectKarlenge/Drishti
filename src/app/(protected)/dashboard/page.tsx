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
import { collection, getDocs } from "@firebase/firestore";
import { db } from "@/firebase/config";
import { FaFire } from "react-icons/fa";
import { MdOutlineSentimentSatisfied } from "react-icons/md";

const HeatmapMap = dynamic(() => import("@/components/HeatmapMap"), {
  ssr: false,
});

interface CameraValue {
  crowdSentiment: string;
  isFire: string;
  peopleCount: number;
}

type RoleCounts = {
  [key: string]: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState<RoleCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState<number | null>(0);
  const [isFire, setIsFire] = useState<string | null>(null);
  const [crowdSentiment, setCrowdSentiment] = useState<string | null>(null);

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
    const fetchCameraDetails = async () => {
      try {
        const snapshot = await getDocs(collection(db, "camera_detections"));
        const fetched: CameraValue[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            crowdSentiment: data.crowd_sentiment,
            isFire: data.is_fire,
            peopleCount: data.people_count,
          };
        });
        if (fetched.length > 0) {
          const first = fetched[0];
          console.log(first);
          setCrowdSentiment(first.crowdSentiment);
          setIsFire(first.isFire);
          setPeopleCount(first.peopleCount);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchCameraDetails();
  }, []);

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
              label: "3C",
              value: `${peopleCount ?? 1} / 130`,
              density: ((peopleCount ?? 1) / 130).toFixed(2) + "%",
              color: "green",
            },
            {
              label: "2B",
              value: "110 / 130",
              density: "84%",
              color: "orange",
            },
            {
              label: "1A",
              value: "130 / 130",
              density: "100%",
              color: "red",
            },
            {
              label: "4D",
              value: "125 / 130",
              density: "96%",
              color: "red",
            },
            {
              label: "4C",
              value: "115 / 130",
              density: "88%",
              color: "yellow",
            },
            {
              label: "3A",
              value: "108 / 130",
              density: "83%",
              color: "green",
              heat: true,
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
              {zone.heat && (
                <Typography variant="body2">
                  {isFire && isFire !== "N/A" ? (
                    <>
                      <FaFire /> {isFire} •
                    </>
                  ) : null}
                  {crowdSentiment && crowdSentiment !== "N/A" ? (
                    <>
                      <MdOutlineSentimentSatisfied /> {crowdSentiment}
                    </>
                  ) : null}
                </Typography>
              )}
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
