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
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Navbar from "../components/navbar";
import { getAllLands, createLand } from "../api/lands.api";

export default function Lands() {
  const [lands, setLands] = useState([]);
  const [open, setOpen] = useState(false);

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
    // required fields check
    if (!form.farmer_id || !form.area || !form.location) {
      alert("Farmer ID, Area, and Location are mandatory");
      return;
    }

    const payload = {
      farmer_id: Number(form.farmer_id),
      area: Number(form.area),
      location: form.location,
      soil_type: form.soil_type || null,
      group_id: form.group_id ? Number(form.group_id) : null
    };

    try {
      await createLand(payload);
      setOpen(false);
      setForm({
        farmer_id: "",
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

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lands
        </Typography>

        {/* ---------- LAND TABLE ---------- */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farmer ID</TableCell>
              <TableCell>Group ID</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Soil Type</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lands.map((land) => (
              <TableRow key={land.id}>
                <TableCell>{land.id}</TableCell>
                <TableCell>{land.farmer_id}</TableCell>
                <TableCell>{land.group_id ?? "-"}</TableCell>
                <TableCell>{land.area}</TableCell>
                <TableCell>{land.location}</TableCell>
                <TableCell>{land.soil_type ?? "-"}</TableCell>
                <TableCell>
                  {new Date(land.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* ---------- ADD BUTTON ---------- */}
      <Fab
        color="primary"
        sx={{ position: "fixed", top: 80, right: 40 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* ---------- ADD LAND DIALOG ---------- */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Land</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Farmer ID *"
            type="number"
            value={form.farmer_id}
            onChange={(e) =>
              setForm({ ...form, farmer_id: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Group ID (optional)"
            type="number"
            value={form.group_id}
            onChange={(e) =>
              setForm({ ...form, group_id: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Area *"
            type="number"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
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
