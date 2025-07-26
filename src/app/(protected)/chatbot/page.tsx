"use client";

import { Box, Button, Paper, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const accessToken = "ya29.a0AS3H6Nzp-NhDt8XEzk1kO0Y3K3PE10GOt2PAhLAByvRM-LiCWZEMUzTMLA01C3x34TsMbqHRmNWTRuz8PR0alWsAQMLxo4S8lF5tORCZGLQk9gcVRBeQoyMil_uJwmg8OApYrFWJwQW9n4ZzMqPJ3WqheIa9__gD0NfV84N9MzdrK0oaCgYKAZsSARcSFQHGX2MihwA1Mrqnbq9VHSKvH22L3Q0182"
  const projectId = "tokyo-unity-466206-g8";
  const location = "us-central1";
  const reasoningEngineId = "3261828787146326016"; 
  const userId = "user-1";

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch(
          `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/reasoningEngines/${reasoningEngineId}/sessions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(data));
        const id = data.name.split("/").pop();
        // setSessionId(id);
        setSessionId('8699347543835803648');
        console.log("Session ID:", id);
      } catch (err) {
        console.error("Error creating session:", err);
      }
    };

    createSession();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) {
      console.warn("Input is empty. Skipping send.");
      return;
    }
    if (!sessionId) {
      console.error("Session ID is not available. Cannot send message.");
      return;
    }
  
    const userText = input.trim();
    console.log("User input:", userText);
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    console.log("User message added to chat");
  
    try {
      console.log("Sending request to Vertex AI Reasoning Engine...");
      const response = await fetch(
        `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/reasoningEngines/${reasoningEngineId}:streamQuery?alt=sse`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_method: "stream_query",
            input: {
              user_id: userId,
              session_id: sessionId,
              message: userText,
            },
          }),
        }
      );
  

  
      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response from Vertex AI.");
      }
      console.log(JSON.stringify(response))
  
      const reader = response.body.getReader();
      console.log("Response status:", reader);

      const decoder = new TextDecoder("utf-8");
      console.log("Response status:", decoder);

      let botText = "";
  
  
      
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error getting response from Vertex AI." },
      ]);
    }
  };
  

  return (
    <Box
      sx={{
        height: "85vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          mb: 2,
          mt: 8,
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
              whiteSpace: "pre-wrap",
            }}
          >
            {msg.text}
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", gap: 1, width: "70%" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} sx={{ minWidth: "50px", p: 1 }}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}
