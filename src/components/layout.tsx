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
  IconButton
} from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from '../lib/auth';


const drawerWidth = 240;
const navItems = ["Dashboard", "Live Camera", "Alerts", "Security"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">Google Hackathon &nbsp; 22:30:45</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="AI System Online" color="success" size="small" />
            <Avatar alt="User" src="https://i.pravatar.cc/300" />
            <IconButton onClick={logout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Body under AppBar */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: 8 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#f5f5f5",
              top: 64, // height of AppBar to push drawer below it
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
