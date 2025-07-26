"use client";

import { Box, Button, Paper, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";

type Message = {
  sender: "user" | "bot";
  text: string | null;
};

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [accessToken, setaccessToken] = useState("");

  var markdown = require("markdown").markdown;

  // const accessToken =
  //   "ya29.a0AS3H6Nz40iompCFvD99PJl_WmWWS87v3ssaXvyGj_Ad4GxH2SX3fTzHnYwCHqqubnHZ4atl2mfv9D4szU6PdfI83hfB0z6ClC7E2A9itJPJqogMWijvYy-zX562_ojSvGkBGpnXmC7J8rYL9D6FZgOYchkpmSCfh8v0dHpPjoTBPNTIaCgYKAX0SARcSFQHGX2MiFw9j60ejtJDxApHp6aIypg0182";
  const projectId = "tokyo-unity-466206-g8";
  const location = "us-central1";
  const reasoningEngineId = "7746851066053918720";

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const userkiid = crypto.randomUUID();
    setUserId(userkiid);

    async function startSessionFlow() {
      try {
        const res = await fetch("/api/gcloudToken");
        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching token:", data.error);
          return;
        }

        const token = data.token;
        setaccessToken(token);

        // ✅ Now create the session with the valid token
        const response = await fetch(
          `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/reasoningEngines/${reasoningEngineId}/sessions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userkiid }),
          }
        );

        const sessionData = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(sessionData));

        const sessionMatch = sessionData.name.match(/\/sessions\/([^/]+)/);
        const sessionId = sessionMatch ? sessionMatch[1] : null;
        setSessionId(sessionId);
        console.log("Session ID:", sessionId);
      } catch (err) {
        console.error("Session flow error:", err);
      }
    }

    startSessionFlow();
  }, []);

  // useEffect(() => {
  //   const userkiid = crypto.randomUUID();
  //   console.log(userkiid);
  //   setUserId(userkiid);
  //   async function fetchToken() {
  //     try {
  //       const res = await fetch('/api/gcloudToken');
  //       const data = await res.json();
  //       if (res.ok) {
  //         setaccessToken(data.token);
  //       } else {
  //         console.error('Error fetching token:', data.error);
  //       }
  //     } catch (err) {
  //       console.error('Network error:', err);
  //     }
  //   }

  //   const createSession = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/reasoningEngines/${reasoningEngineId}/sessions`,
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ userId: userkiid }),
  //         }
  //       );

  //       const data = await response.json();
  //       if (!response.ok) throw new Error(JSON.stringify(data));
  //       const sessionMatch = data.name.match(/\/sessions\/([^/]+)/);
  //       const sessionId = sessionMatch ? sessionMatch[1] : null;

  //       setSessionId(sessionId);
  //       console.log("Session ID:", sessionId);
  //     } catch (err) {
  //       console.error("Error creating session:", err);
  //     }
  //   };

  //   fetchToken();

  //   createSession();
  // }, []);

  async function extractBotText(response: Response) {
    const raw = await response.text();
    console.log("Raw response:", raw);

    console.log(typeof raw);

    const match =
      raw.match(/"text"\s*:\s*"((?:\\.|[^"\\])*)"/) ||
      raw.match(/"context"\s*:\s*"((?:\\.|[^"\\])*)"/);

    if (match && match[1]) {
      return match[1].replace(/\\"/g, '"');
    }

    return null;
  }

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

      const botText = await extractBotText(response);
      const parser = new DOMParser();
      const finalBotText: string = botText
  ? parser
      .parseFromString(botText, "text/html")
      .body.textContent?.replace(/[\n*]/g, "") || ""
  : "";


      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: finalBotText ?? "Sorry I could not fetch a response at this time! Please check your connection and try again!" },
      ]);
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error getting response from Vertex AI." },
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

      <Box sx={{ display: "flex", gap: 1, width: "80%" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{ minWidth: "50px", p: 1 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}
