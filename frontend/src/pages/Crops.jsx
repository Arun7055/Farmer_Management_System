import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import { getAllCrops, createCrop } from "../api/crops.api";

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [open, setOpen] = useState(false);

  const currentFarmerId = Number(localStorage.getItem("farmer_id"));

  // DEBUG: Log current farmer ID
  console.log("[CURRENT FARMER]", currentFarmerId, "type:", typeof currentFarmerId);

  /* ---------------- FILTERS ---------------- */
  const [cropFilter, setCropFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [farmerFilter, setFarmerFilter] = useState("");

  const [form, setForm] = useState({
    land_id: "",
    crop_name: "",
    growth_stage: "",
    expected_yield: ""
  });

  const fetchCrops = async () => {
    const res = await getAllCrops();
    setCrops(res.data);
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredCrops = crops.filter((crop) => {
    const cropFarmerId = Number(crop.farmer_id);
    const isMine = cropFarmerId === currentFarmerId;

    // DEBUG: Log filtering conditions
    console.log(
      `[FILTER CHECK] Crop ${crop.id}`,
      "| crop.farmer_id:", cropFarmerId,
      "| currentFarmerId:", currentFarmerId,
      "| isMine:", isMine
    );

    const cropMatch = cropFilter
      ? crop.crop_name.toLowerCase().includes(cropFilter.toLowerCase())
      : true;

    const stageMatch = stageFilter
      ? crop.growth_stage?.toLowerCase().includes(stageFilter.toLowerCase())
      : true;

    const ownerMatch =
      ownerFilter === "mine"
        ? isMine
        : ownerFilter === "others"
        ? !isMine
        : true;

    const farmerMatch = farmerFilter
      ? cropFarmerId.toString().includes(farmerFilter)
      : true;

    return cropMatch && stageMatch && ownerMatch && farmerMatch;
  });

  /* ---------------- CREATE ---------------- */
  const handleCreate = async () => {
    if (!form.land_id || !form.crop_name) {
      alert("Land ID and Crop Name are required");
      return;
    }

    await createCrop({
      ...form,
      land_id: Number(form.land_id),
      expected_yield: form.expected_yield
        ? Number(form.expected_yield)
        : null
    });

    setOpen(false);
    setForm({
      land_id: "",
      crop_name: "",
      growth_stage: "",
      expected_yield: ""
    });
    fetchCrops();
  };

  return (
    <>
      <Navbar />

      <Box p={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Crops</Typography>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* FILTER BAR */}
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Crop Name"
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
          />
          <TextField
            label="Growth Stage"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          />
          <TextField
            select
            label="Owner"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="mine">My Crops</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </TextField>
          <TextField
            label="Farmer ID"
            value={farmerFilter}
            onChange={(e) => setFarmerFilter(e.target.value)}
          />
        </Box>

        {/* TABLE */}
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Land ID</TableCell>
              <TableCell>Crop</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Expected Yield</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Farmer ID</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCrops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.id}</TableCell>
                <TableCell>{crop.land_id}</TableCell>
                <TableCell>{crop.crop_name}</TableCell>
                <TableCell>{crop.growth_stage || "—"}</TableCell>
                <TableCell>{crop.expected_yield || "—"}</TableCell>
                <TableCell>
                  {new Date(crop.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{crop.farmer_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Crop</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Land ID *"
            margin="dense"
            value={form.land_id}
            onChange={(e) => setForm({ ...form, land_id: e.target.value })}
          />
          <TextField
            fullWidth
            label="Crop Name *"
            margin="dense"
            value={form.crop_name}
            onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Growth Stage"
            margin="dense"
            value={form.growth_stage}
            onChange={(e) =>
              setForm({ ...form, growth_stage: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Expected Yield"
            margin="dense"
            value={form.expected_yield}
            onChange={(e) =>
              setForm({ ...form, expected_yield: e.target.value })
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
