import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "../components/navbar";
import StyledTable from "../components/StyledTable";
import { getAllLands, createLand } from "../api/lands.api";

export default function Lands() {
  const [lands, setLands] = useState([]);
  const [open, setOpen] = useState(false);

  /* ================= CURRENT FARMER ================= */
  const storedFarmerId = localStorage.getItem("farmer_id");

const currentFarmerId =
  storedFarmerId && !isNaN(parseInt(storedFarmerId, 10))
    ? parseInt(storedFarmerId, 10)
    : null;

  // DEBUG (comment later)
  console.log(
    "[CURRENT FARMER]",
    currentFarmerId,
    "type:",
    typeof currentFarmerId
  );

  /* ================= FILTER STATE ================= */
  const [ownerFilter, setOwnerFilter] = useState("all"); // all | mine | others
  const [soilFilter, setSoilFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    farmer_id: "",
    group_id: "",
    area: "",
    location: "",
    soil_type: ""
  });

  /* ================= FETCH ALL LANDS ================= */
  const fetchLands = async () => {
    try {
      const res = await getAllLands();

      // DEBUG
      console.log("[LANDS RAW RESPONSE]", res.data);
      res.data.forEach((land) => {
        console.log(
          `[LAND ${land.id}] farmer_id =`,
          land.farmer_id,
          "type:",
          typeof land.farmer_id
        );
      });

      setLands(res.data);
    } catch (err) {
      console.error("Error fetching lands", err);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  /* ================= CREATE LAND ================= */
  const handleCreate = async () => {
    if (!currentFarmerId || !form.area || !form.location) {
      alert("Farmer ID, Area, and Location are mandatory");
      return;
    }

    const payload = {
      farmer_id: currentFarmerId, // Use farmer_id from localStorage
      group_id: form.group_id ? Number(form.group_id) : null,
      area: Number(form.area),
      location: form.location,
      soil_type: form.soil_type || null
    };

    try {
      await createLand(payload);
      setOpen(false);
      setForm({
        group_id: "",
        area: "",
        location: "",
        soil_type: ""
      });
      fetchLands();
    } catch (err) {
      console.error("Error creating land", err);
    }
  };

  /* ================= FILTERED DATA ================= */
  const filteredLands = lands.filter((land) => {
    const landFarmerId = Number(land.farmer_id);
    const isMine = landFarmerId === currentFarmerId;

    // DEBUG (comment later)
    console.log(
      `[FILTER CHECK] Land ${land.id}`,
      "| land.farmer_id:", landFarmerId,
      "| currentFarmerId:", currentFarmerId,
      "| isMine:", isMine
    );

    if (ownerFilter === "mine" && !isMine) return false;
    if (ownerFilter === "others" && isMine) return false;
    if (
      soilFilter &&
      !land.soil_type?.toLowerCase().includes(soilFilter.toLowerCase())
    ) {
      return false;
    }
    if (
      locationFilter &&
      !land.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
      return false;

    return true;
  });

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <Box sx={{ p: 4, minHeight: "100vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            mb: 3
          }}
        >
          Lands
        </Typography>

        {/* ---------- FILTERS ---------- */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Owner</InputLabel>
            <Select
              value={ownerFilter}
              label="Owner"
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <MenuItem value="all">All Lands</MenuItem>
              <MenuItem value="mine">My Lands</MenuItem>
              <MenuItem value="others">Others' Lands</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Soil Type"
            value={soilFilter}
            onChange={(e) => setSoilFilter(e.target.value)}
          />

          <TextField
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </Box>

        {/* ---------- LAND TABLE ---------- */}
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farmer ID</TableCell>
              {/* <TableCell>Group ID</TableCell> */}
              <TableCell>Area</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Soil Type</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLands.map((land) => (
              <TableRow key={land.id}>
                <TableCell>{land.id}</TableCell>
                <TableCell>{land.farmer_id}</TableCell>
                {/* <TableCell>{land.group_id ?? "—"}</TableCell> */}
                <TableCell>{land.area}</TableCell>
                <TableCell>{land.location}</TableCell>
                <TableCell>{land.soil_type ?? "—"}</TableCell>
                <TableCell>
                  {new Date(land.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Box>

      {/* ---------- ADD BUTTON ---------- */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          top: 80,
          right: 40,
          background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
          transition: "all 0.3s",
          "&:hover": {
            transform: "translateY(-2px) scale(1.05)",
            boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
          }
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* ---------- ADD LAND DIALOG ---------- */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Land</DialogTitle>

        <DialogContent>
          {/* <TextField
            fullWidth
            margin="dense"
            label="Group ID (optional)"
            type="number"
            value={form.group_id}
            onChange={(e) =>
              setForm({ ...form, group_id: e.target.value })
            }
          /> */}

          <TextField
            fullWidth
            margin="dense"
            label="Area *"
            type="number"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Location *"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Soil Type"
            value={form.soil_type}
            onChange={(e) =>
              setForm({ ...form, soil_type: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
