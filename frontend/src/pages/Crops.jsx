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
  TableBody
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { getAllCrops, createCrop } from "../api/crops.api";

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    land_id: "",
    crop_name: "",
    growth_stage: "",
    expected_yield: ""
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await getAllCrops();
    setCrops(res.data);
  };

  const handleCreate = async () => {
    if (!form.land_id || !form.crop_name) {
      alert("Land ID and Crop Name are required");
      return;
    }

    await createCrop(form);
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
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Crops</Typography>
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Table */}
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Land ID</TableCell>
              <TableCell>Crop Name</TableCell>
              <TableCell>Growth Stage</TableCell>
              <TableCell>Expected Yield</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>{crop.id}</TableCell>
                <TableCell>{crop.land_id}</TableCell>
                <TableCell>{crop.crop_name}</TableCell>
                <TableCell>{crop.growth_stage || "—"}</TableCell>
                <TableCell>{crop.expected_yield || "—"}</TableCell>
                <TableCell>
                  {new Date(crop.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Add Crop Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Crop</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Land ID *"
            margin="normal"
            value={form.land_id}
            onChange={(e) =>
              setForm({ ...form, land_id: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Crop Name *"
            margin="normal"
            value={form.crop_name}
            onChange={(e) =>
              setForm({ ...form, crop_name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Growth Stage"
            margin="normal"
            value={form.growth_stage}
            onChange={(e) =>
              setForm({ ...form, growth_stage: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Expected Yield"
            type="number"
            margin="normal"
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
