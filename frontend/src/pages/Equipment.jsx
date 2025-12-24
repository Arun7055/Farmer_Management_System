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
  import { getEquipment, createEquipment } from "../api/equipment.api";
  
  export default function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [open, setOpen] = useState(false);
  
    const [form, setForm] = useState({
      farmer_id: "",
      group_id: "",
      name: "",
      type: "",
      availability: true
    });
  
    useEffect(() => {
      fetchEquipment();
    }, []);
  
    const fetchEquipment = async () => {
      const res = await getEquipment();
      setEquipment(res.data);
    };
  
    const handleCreate = async () => {
      if (!form.name) {
        alert("Equipment name is required");
        return;
      }
  
      await createEquipment(form);
      setOpen(false);
      setForm({
        farmer_id: "",
        group_id: "",
        name: "",
        type: "",
        availability: true
      });
      fetchEquipment();
    };
  
    return (
      <>
        <Navbar />
  
        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Equipment</Typography>
            <IconButton color="primary" onClick={() => setOpen(true)}>
              <AddIcon />
            </IconButton>
          </Box>
  
          <Table sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Farmer ID</TableCell>
                <TableCell>Group ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {equipment.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.id}</TableCell>
                  <TableCell>{eq.farmer_id || "—"}</TableCell>
                  <TableCell>{eq.group_id || "—"}</TableCell>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.type || "—"}</TableCell>
                  <TableCell>{eq.availability ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(eq.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
  
        {/* Add Equipment Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Add Equipment</DialogTitle>
  
          <DialogContent>
            <TextField
              fullWidth
              label="Farmer ID"
              margin="normal"
              value={form.farmer_id}
              onChange={(e) =>
                setForm({ ...form, farmer_id: e.target.value })
              }
            />
  
            <TextField
              fullWidth
              label="Group ID"
              margin="normal"
              value={form.group_id}
              onChange={(e) =>
                setForm({ ...form, group_id: e.target.value })
              }
            />
  
            <TextField
              fullWidth
              label="Equipment Name *"
              margin="normal"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
  
            <TextField
              fullWidth
              label="Type"
              margin="normal"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
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
  