"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { loginWithGoogle } from "../lib/auth";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { keyframes } from '@emotion/react';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(1deg);
  }
`;


const stats = [
  { label: "Incidents Prevented", value: 2300 },
  { label: "Cities Covered", value: 42 },
  { label: "24/7 Active Hours", value: 8760 },
];

const features = [
  {
    icon: "📊",
    title: "Real-Time Analytics",
    description:
      "Monitor crowd density, movement patterns, and potential bottlenecks in real-time with advanced AI algorithms and live data visualization.",
  },
  {
    icon: "🚨",
    title: "Smart Alerts",
    description:
      "Receive instant notifications about overcrowding, unusual patterns, or emergency situations to take immediate action.",
  },
  {
    icon: "🎯",
    title: "Predictive Modeling",
    description:
      "Forecast crowd behavior and peak times using machine learning to plan resources and prevent issues before they occur.",
  },
  {
    icon: "📱",
    title: "Mobile Dashboard",
    description:
      "Access all critical alerts and insights on the go with a mobile-friendly dashboard.",
  },
  {
    icon: "🔄",
    title: "Integration Ready",
    description:
      "Seamlessly connect with your existing infrastructure and tools for a smooth rollout.",
  },
  {
    icon: "📈",
    title: "Advanced Reports",
    description:
      "Generate detailed analytics reports for performance review and planning.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const intervals = stats.map((stat, index) =>
      setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[index] < stat.value) {
            updated[index] += Math.ceil(stat.value / 100);
          }
          return updated;
        });
      }, 30)
    );
    return () => intervals.forEach(clearInterval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f8f9fb, #f0f1f5)" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold">
            Drishti
          </Typography>
          <Stack direction="row" spacing={4}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGoogleLogin}
              sx={{
                borderRadius: 8,
                px: 3,
                fontWeight: "bold",
                background: "#ff5f8f",
              }}
            >
              Admin Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ height: "100vh" }}>
        <Container
          maxWidth="md"
          sx={{
            textAlign: "center",
            py: 10,
            background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(203,213,225,0.3)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
            animation: `${float} 20s ease-in-out infinite`,
          }}
        >

          
          <Typography variant="h1" fontWeight="bold" gutterBottom>
            Smart Crowd Management for Safer Events
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Revolutionize how you monitor, analyze, and manage crowds with our
            AI-powered platform. Ensure safety, optimize flow, and create better
            experiences.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Button
              variant="contained"
              onClick={handleGoogleLogin}
              sx={{
                borderRadius: 8,
                px: 4,
                background: "#ff5f8f",
                fontWeight: "bold",
              }}
            >
              Admin Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 8,
                px: 4,
                color: "#ff5f8f",
                borderColor: "#ff5f8f",
              }}
            >
              Download the App
            </Button>
          </Stack>
        </Container>
        <Container maxWidth="md" sx={{ textAlign: "center", pb: 10 }}>
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            flexWrap="wrap"
          >
            {stats.map((stat, idx) => (
              <Box key={stat.label} sx={{ minWidth: 150 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {counts[idx]}
                </Typography>
                <Typography color="text.secondary">{stat.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Powerful Features
        </Typography>
        <Box sx={{ display: "flex", gap: "32px", mb: "32px" }}>
          {features.slice(0, 3).map((feature) => (
            <Box
              key={feature.title}
              flex={1}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  width: "100%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      width: "80px",
                      height: "80px",
                      background: `linear-gradient(45deg, #ddd6fe, #c7d2fe)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: `0 auto 1.5rem`,
                      fontSize: "2rem",
                      color: "#6366f1",
                    }}
                  >``
                    {feature.icon}``
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "#475569" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: "32px", mb: "32px" }}>
          {features.slice(3, 6).map((feature) => (
            <Box key={feature.title}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      width: "80px",
                      height: "80px",
                      background: `linear-gradient(45deg, #ddd6fe, #c7d2fe)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: `0 auto 1.5rem`,
                      fontSize: "2rem",
                      color: "#6366f1",
                    }}
                  >
                    {feature.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "#475569" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

       
      </Container>
      <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#fff" }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#475569" }}
            gutterBottom
          >
            Ready to Transform Your Crowd Management?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Join event organizers, venue managers, and security
            professionals who trust Drishti to keep their crowds safe and
            events running smoothly.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoogleLogin}
            sx={{
              borderRadius: 8,
              px: 4,
              background: "linear-gradient(45deg, #fce7f3, #fbb6ce)",
              color: "#be185d",
              fontWeight: "bold",
            }}
          >
            Are you ready ?
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
