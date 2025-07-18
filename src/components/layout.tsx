"use client";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/auth";
import HeaderClock from "./HeaderClock";

const drawerWidth = 240;
const navItems = ["Dashboard", "Live Camera", "Alerts", "Security"];

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
            {navItems.map((text) => (
              <ListItemButton
                key={text}
                selected={pathname.includes(text.toLowerCase())}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
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
