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
  ListItemText
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/auth";
import HeaderClock from "./HeaderClock";
import Link from "next/link";
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

            <IconButton  color="inherit">
              <EditNotificationsIcon />
            </IconButton>
            <IconButton onClick={logout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1, mt: 8 }}>
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
            <Link href="/dashboard" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton
                selected={pathname === "/dashboard"}
              >
                <ListItemText>
                              Dashboard
                  </ListItemText>
              </ListItemButton>
            </Link>

            <Link href="/livecamera" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton
                selected={pathname === "/livecamera"}
              >
                Live Camera
              </ListItemButton>
            </Link>

            <Link href="/alerts" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton selected={pathname === "/alerts"} >
                Alerts
              </ListItemButton>
            </Link>

            {/* <Link href="/security" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton selected={pathname === "/security"} >
                Security
              </ListItemButton>
            </Link> */}

            <Link href="/chatbot" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton selected={pathname === "/chatbot"} >
                ChatBot
              </ListItemButton>
            </Link>

            <Link href="/roleassign" passHref style={{ textDecoration: "none", color: "black" }}>
              <ListItemButton selected={pathname === "/roleassign"} >
                Role Allot
              </ListItemButton>
            </Link>
          </List>

        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#fafafa",
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
