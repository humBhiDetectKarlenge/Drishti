import CrowdFlowChart from "@/components/CrowdFlowChart";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

const zones = [
  {
    name: "Main Entrance",
    count: 1247,
    capacity: 1500,
    flow: "+45/min",
    status: "CROWDED",
  },
  {
    name: "Food Court",
    count: 892,
    capacity: 1200,
    flow: "+12/min",
    status: "BUSY",
  },
  {
    name: "Exhibition Hall A",
    count: 456,
    capacity: 800,
    flow: "-5/min",
    status: "NORMAL",
  },
  {
    name: "Emergency Exit 1",
    count: 23,
    capacity: 200,
    flow: "+2/min",
    status: "NORMAL",
  },
];

const statusColors = {
  CROWDED: { bg: "#F8D7DA", color: "#721C24" },
  BUSY: { bg: "#FFF3CD", color: "#856404" },
  NORMAL: { bg: "#D4EDDA", color: "#155724" },
};

export default function ZoneStatusOverview() {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        gap: "12px",
        flexDirection: "column",
        mt: 8,
        backgroundColor: "#fafafa",
        boxShadow:'none'
      }}
    >
      <Paper sx={{ p: 2 }}>
        <CrowdFlowChart />
      </Paper>
      <Paper
        sx={{
          background: "linear-gradient(90deg, #5D62FB, #9A55FF)",
          padding: "16px",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Zone Status Overview
        </Typography>
      </Paper>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Zone Name</strong>
              </TableCell>
              <TableCell>
                <strong>Current Count</strong>
              </TableCell>
              <TableCell>
                <strong>Capacity</strong>
              </TableCell>
              <TableCell>
                <strong>Flow Rate</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((zone, idx) => (
              <TableRow key={idx}>
                <TableCell>{zone.name}</TableCell>
                <TableCell>{zone.count.toLocaleString()}</TableCell>
                <TableCell>{zone.capacity.toLocaleString()}</TableCell>
                <TableCell>{zone.flow}</TableCell>
                <TableCell>
                  <Chip
                    label={zone.status}
                    sx={{
                      backgroundColor:
                        statusColors[zone.status as keyof typeof statusColors]
                          .bg,
                      color:
                        statusColors[zone.status as keyof typeof statusColors]
                          .color,
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
