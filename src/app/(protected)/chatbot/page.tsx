"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input.trim() };
    const botMsg: Message = { sender: "bot", text: "This is a bot response." };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <Box
      sx={{
        height: "85vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
     

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          mb: 2,
          mt:2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          width: "100%",
          maxWidth: "800px",
        }}
        ref={scrollRef}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#1976d2" : "#eeeeee",
              color: msg.sender === "user" ? "white" : "black",
              px: 2,
              py: 1,
              borderRadius: 2,
              mb: 1,
              maxWidth: "80%",
            }}
          >
            {msg.text}
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", gap: 1 , width: "70%"}}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
       <Button variant="contained" onClick={handleSend} sx={{ minWidth: '50px', p: 1 }}>
       <SendIcon />

</Button>
      </Box>
    </Box>
  );
}
