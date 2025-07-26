"use client";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Avatar,
  List,
  ListItemButton,
  Divider,
  Chip,
  IconButton,
  ListItemText,
  TextField,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemIcon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/auth";
import HeaderClock from "./HeaderClock";
import Link from "next/link";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import { Snackbar, Alert } from "@mui/material";
import { resolve } from "path";

import Dashboard from "@mui/icons-material/Dashboard";
import { MdOutlineDashboard, MdOutlinePeople } from "react-icons/md";
import { PiMapPinArea } from "react-icons/pi";
import { TbAlertSquare, TbMessageChatbot } from "react-icons/tb";
import { BiCctv } from "react-icons/bi";
const drawerWidth = 240;




export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />

      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <HeaderClock />

          <Box display="flex" alignItems="center" gap={2}>
            <Chip label={currentUser?.email} color="success" size="small" />
            {currentUser?.photoURL ? (
              <Avatar
                src={currentUser.photoURL}
                alt={currentUser.displayName || "User"}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }}>
                {(currentUser?.displayName || currentUser?.email || "U")[0]}
              </Avatar>
            )}

            {/* <IconButton
              color="inherit"
              onClick={() => setNotifDrawerOpen(true)}
            >
              <EditNotificationsIcon />
            </IconButton> */}

            <IconButton onClick={logout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* <Drawer
        anchor="right"
        open={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Send Notification</Typography>
            <IconButton onClick={() => setNotifDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="topic-label">Topic</InputLabel>
              <Select
                labelId="topic-label"
                value={selectedTopic}
                label="Topic"
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="crowd">Crowd</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="police">Police</MenuItem>
                <MenuItem value="help">Help</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Title"
              fullWidth
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
            />
            <TextField
              label="Body"
              fullWidth
              multiline
              rows={4}
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  const res = await fetch("/api/send-notification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      topic:
                        selectedTopic === "all" ? "general" : selectedTopic,
                      title: notifTitle,
                      body: notifBody,
                    }),
                  });

                  const result = await res.json();

                  if (!res.ok || !result.success) {
                    throw new Error(
                      result.error || "Failed to send notification."
                    );
                  }

                  setSnackbarMsg("Notification sent successfully!");
                  setSnackbarSeverity("success");
                  setSnackbarOpen(true);

                  setNotifDrawerOpen(false);
                  setNotifTitle("");
                  setNotifBody("");
                } catch (err) {
                  if (err instanceof Error) {
                    setSnackbarMsg(err.message);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                  }
                }
              }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Drawer> */}

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#f5f5f5",
              top: 64,
            },
          }}
        >
          <Divider />
          <List>
            <Link
              href="/dashboard"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/dashboard"}
                sx={{ display: "flex", gap: 2 }}
              >
                <MdOutlineDashboard />
                <ListItemText>Dashboard</ListItemText>
              </ListItemButton>
            </Link>

            <Link
              href="/livecamera"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/livecamera"}
                sx={{ display: "flex", gap: 2 }}
              >
                <BiCctv />

                <ListItemText> Live Camera</ListItemText>
              </ListItemButton>
            </Link>

            <Link
              href="/alerts"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/alerts"}
                sx={{ display: "flex", gap: 2 }}
              >
                <TbAlertSquare />

                <ListItemText> Alerts</ListItemText>
              </ListItemButton>
            </Link>

            {/* <Link href="/security" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton selected={pathname === "/security"} >
                Security
              </ListItemButton>
            </Link> */}

            <Link
              href="/chatbot"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/chatbot"}
                sx={{ display: "flex", gap: 2 }}
              >
                <TbMessageChatbot />

                <ListItemText> ChatBot</ListItemText>
              </ListItemButton>
            </Link>

            <Link
              href="/zonestatus"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/zonestatus"}
                sx={{ display: "flex", gap: 2 }}
              >
                <PiMapPinArea />

                <ListItemText> Zone Management</ListItemText>
              </ListItemButton>
            </Link>

            <Link
              href="/roleassign"
              passHref
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton
                selected={pathname === "/roleassign"}
                sx={{ display: "flex", gap: 2 }}
              >
                <MdOutlinePeople />
                <ListItemText> UAM </ListItemText>
              </ListItemButton>
            </Link>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#fafafa",
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
