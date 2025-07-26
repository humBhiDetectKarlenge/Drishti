"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

//todo non static 
const data = [
  { time: "6:00 PM", expected: 100, actual: 90 },
  { time: "6:15 PM", expected: 200, actual: 180 },
  { time: "6:30 PM", expected: 350, actual: 400 },
  { time: "6:45 PM", expected: 500, actual: 600 },
  { time: "7:00 PM", expected: 700, actual: 850 },
  { time: "7:15 PM", expected: 900, actual: 1100 },
  { time: "7:30 PM", expected: 1200, actual: 1400 },
];

export default function CrowdFlowChart() {
  return (
    <Box p={3} sx={{ height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Crowd Flow Chart (Expected vs Actual Growth)
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="#8884d8"
            strokeWidth={2}
            name="Expected"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ff7300"
            strokeWidth={2}
            name="Actual"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
