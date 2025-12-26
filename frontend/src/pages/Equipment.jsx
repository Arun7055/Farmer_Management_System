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
  import StyledTable from "../components/StyledTable";
  import { getEquipment, createEquipment, toggleEquipmentAvailability } from "../api/equipment.api";
  import api from "../api/axios";
  
  export default function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [open, setOpen] = useState(false);
  
    const currentFarmerId = Number(localStorage.getItem("farmer_id"));
  
    // DEBUG: Log current farmer ID
    console.log("[CURRENT FARMER]", currentFarmerId, "type:", typeof currentFarmerId);
  
    /* ---------------- FILTERS ---------------- */
    const [nameFilter, setNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [ownerFilter, setOwnerFilter] = useState("all");
  
    const [form, setForm] = useState({
      name: "",
      type: ""
    });
  
    const fetchEquipment = async () => {
      const res = await getEquipment();
      setEquipment(res.data);
    };
  
    useEffect(() => {
      fetchEquipment();
    }, []);
  
    /* ---------------- FILTER LOGIC ---------------- */
    const filteredEquipment = equipment.filter((eq) => {
      const eqFarmerId = Number(eq.farmer_id);
      const isMine = eqFarmerId === currentFarmerId;
  
      // DEBUG: Log filtering conditions
      console.log(
        `[FILTER CHECK] Equipment ${eq.id}`,
        "| eq.farmer_id:", eqFarmerId,
        "| currentFarmerId:", currentFarmerId,
        "| isMine:", isMine
      );
  
      const nameMatch = nameFilter
        ? eq.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
  
      const typeMatch = typeFilter
        ? eq.type?.toLowerCase().includes(typeFilter.toLowerCase())
        : true;
  
      const ownerMatch =
        ownerFilter === "mine"
          ? isMine
          : ownerFilter === "others"
          ? !isMine
          : true;
  
      return nameMatch && typeMatch && ownerMatch;
    });
  
    /* ---------------- CREATE ---------------- */
    const handleCreate = async () => {
      if (!form.name) {
        alert("Equipment name required");
        return;
      }
  
      await createEquipment({
        farmer_id: currentFarmerId,
        name: form.name,
        type: form.type,
        availability: true
      });
  
      setOpen(false);
      setForm({ name: "", type: "" });
      fetchEquipment();
    };
  
    /* ---------------- TOGGLE AVAILABILITY ---------------- */
    const toggleAvailability = async (eq) => {
      try {
        const updatedEquipment = await toggleEquipmentAvailability(eq.id);
        console.log("Updated Equipment:", updatedEquipment);
        fetchEquipment();
      } catch (err) {
        console.error("Failed to toggle availability:", err);
      }
    };
  
    return (
      <>
        <Navbar />

        <Box p={4} sx={{ minHeight: "100vh" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              sx={{
                background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700
              }}
            >
              Equipment
            </Typography>
            <IconButton
              color="primary"
              onClick={() => setOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* FILTER BAR */}
          <Box display="flex" gap={2} mt={2} mb={3}>
            <TextField
              label="Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <TextField
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <TextField
              select
              label="Owner"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="mine">My Equipment</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </TextField>
          </Box>
  
          {/* TABLE */}
          <StyledTable sx={{ mt: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEquipment.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.id}</TableCell>
                  <TableCell>{eq.farmer_id}</TableCell>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.type || "—"}</TableCell>
                  <TableCell>
                    {eq.farmer_id === currentFarmerId ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAvailability(eq);
                        }}
                        sx={{
                          borderColor: eq.availability ? "#f44336" : "#4caf50",
                          color: eq.availability ? "#f44336" : "#4caf50",
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: eq.availability ? "0 4px 12px rgba(244, 67, 54, 0.3)" : "0 4px 12px rgba(76, 175, 80, 0.3)",
                            borderColor: eq.availability ? "#f44336" : "#4caf50",
                            backgroundColor: eq.availability ? "rgba(244, 67, 54, 0.1)" : "rgba(76, 175, 80, 0.1)",
                          }
                        }}
                      >
                        {eq.availability ? "Mark Unavailable" : "Mark Available"}
                      </Button>
                    ) : (
                      eq.availability ? "Available" : "Unavailable"
                    )}
                  </TableCell>
                  <TableCell>
                    {eq.availability ? "Available" : "Unavailable"}
                  </TableCell>
                  <TableCell>
                    {new Date(eq.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </Box>
  
        {/* ADD DIALOG */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Add Equipment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Equipment Name *"
              margin="dense"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Type"
              margin="dense"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
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
