import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Fab,
    Stack,
    Typography,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import NotificationsIcon from "@mui/icons-material/Notifications";
  import { useState } from "react";
  
  export default function NotificationDialogLauncher() {
    const [open, setOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("all");
    const [notifTitle, setNotifTitle] = useState("");
    const [notifBody, setNotifBody] = useState("");
  
    const handleSendNotification = async () => {
      try {
        const res = await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: selectedTopic === "all" ? "general" : selectedTopic,
            title: notifTitle,
            body: notifBody,
          }),
        });
  
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to send notification.");
        }
  
        setOpen(false);
        setNotifTitle("");
        setNotifBody("");
      } catch (err: any) {
        alert(err.message); 
      }
    };
  
    return (
      <>
        <Fab
  aria-label="send notification"
  onClick={() => setOpen(true)}
  sx={{
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #dc3545, #c82333)",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(220, 53, 69, 0.3)",
    transition: "all 0.3s ease",

    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 15px 35px rgba(220, 53, 69, 0.4)",
    },
  }}
>
  🚨
</Fab>

  
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Send Notification
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSendNotification} variant="contained">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  