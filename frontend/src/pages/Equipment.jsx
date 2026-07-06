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
  MenuItem,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import StyledTable from "../components/StyledTable";
import {
  getEquipment,
  createEquipment,
  toggleEquipmentAvailability
} from "../api/equipment.api";

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [open, setOpen] = useState(false);

  const [requestedEquipment, setRequestedEquipment] = useState([]);
  const [showRequested, setShowRequested] = useState(false);

  const currentFarmerId = Number(localStorage.getItem("farmer_id"));

  /* ---------------- LOAD REQUESTS FROM LOCALSTORAGE ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("requested_equipment");
    if (stored) {
      setRequestedEquipment(JSON.parse(stored));
    }
  }, []);

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
    const isMine = Number(eq.farmer_id) === currentFarmerId;

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
    await toggleEquipmentAvailability(eq.id);
    fetchEquipment();
  };

  /* ---------------- REQUEST (FRONTEND ONLY) ---------------- */
  const isRequested = (eqId) =>
    requestedEquipment.some((r) => r.equipment.id === eqId);

  const handleRequest = (eq) => {
    if (isRequested(eq.id)) return;

    const newRequest = {
      equipment: eq,
      requestedBy: currentFarmerId
    };

    const updated = [...requestedEquipment, newRequest];
    setRequestedEquipment(updated);
    localStorage.setItem("requested_equipment", JSON.stringify(updated));
  };

  const removeRequest = (eqId) => {
    const updated = requestedEquipment.filter(
      (r) => r.equipment.id !== eqId
    );

    setRequestedEquipment(updated);
    localStorage.setItem("requested_equipment", JSON.stringify(updated));
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
            onClick={() => setOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* FILTER BAR */}
        <Box display="flex" gap={2} mb={3}>
          <TextField label="Name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          <TextField label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
          <TextField select label="Owner" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="mine">My Equipment</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </TextField>
        </Box>

        {/* MAIN TABLE */}
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEquipment.map((eq) => {
              const isMine = eq.farmer_id === currentFarmerId;

              return (
                <TableRow key={eq.id}>
                  <TableCell>{eq.id}</TableCell>
                  <TableCell>{eq.farmer_id}</TableCell>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.type || "—"}</TableCell>
                  <TableCell>{eq.availability ? "Available" : "Unavailable"}</TableCell>

                  <TableCell>
                    {isMine ? (
                      <Button size="small" variant="outlined" onClick={() => toggleAvailability(eq)}>
                        {eq.availability ? "Mark Unavailable" : "Mark Available"}
                      </Button>
                    ) : eq.availability ? (
                      isRequested(eq.id) ? (
                        <Button size="small" disabled>
                          Requested
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleRequest(eq)}
                        >
                          Request
                        </Button>
                      )
                    ) : (
                      "Unavailable"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>

        {/* REQUESTED SECTION */}
        <Divider sx={{ my: 4 }} />

        <Button variant="outlined" onClick={() => setShowRequested((p) => !p)}>
          {showRequested ? "Hide Requested Equipment" : "Show Requested Equipment"}
        </Button>

        {showRequested && (
          <Box mt={3}>
            <Typography variant="h6" mb={2}>
              Requested Equipment
            </Typography>

            {requestedEquipment.length === 0 ? (
              <Typography color="text.secondary">
                No equipment requested yet.
              </Typography>
            ) : (
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {requestedEquipment.map((req) => {
                    const { equipment: eq, requestedBy } = req;
                    const isOwner = eq.farmer_id === currentFarmerId;

                    return (
                      <TableRow key={eq.id}>
                        <TableCell>{eq.id}</TableCell>
                        <TableCell>{eq.farmer_id}</TableCell>
                        <TableCell>{eq.name}</TableCell>
                        <TableCell>{eq.type || "—"}</TableCell>
                        <TableCell>{requestedBy}</TableCell>
                        <TableCell>
                          {isOwner && (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => removeRequest(eq.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </StyledTable>
            )}
          </Box>
        )}
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
