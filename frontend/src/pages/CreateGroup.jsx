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
  Select,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import { getGroups, createGroup } from "../api/groups.api";

export default function CreateGroups() {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    group_name: "",
    description: ""
  });

  const fetchGroups = async () => {
    const res = await getGroups();
    setGroups(res.data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async () => {
    if (!form.group_name.trim()) {
      alert("Group name is required");
      return;
    }

    await createGroup({
      group_name: form.group_name,
      description: form.description || null
    });

    setOpen(false);
    setForm({ group_name: "", description: "" });
    fetchGroups();
  };

  /* ================= FILTER GROUPS ================= */
  const currentFarmerId = Number(localStorage.getItem("farmer_id"));

  const filteredGroups =
    filter === "mine" && currentFarmerId
      ? groups.filter((g) =>
          g.members?.some((m) => m.farmer_id === currentFarmerId)
        )
      : groups;

  return (
    <>
      <Navbar />

      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Farmer Groups
        </Typography>

        {/* FILTER DROPDOWN */}
        <FormControl sx={{ mb: 2, minWidth: 220 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Groups</MenuItem>
            <MenuItem value="mine">My Groups</MenuItem>
          </Select>
        </FormControl>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredGroups.map((g) => (
              <TableRow
                key={g.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/groups/${g.id}`)}
              >
                <TableCell>{g.id}</TableCell>
                <TableCell>{g.group_name}</TableCell>
                <TableCell>{g.description ?? "-"}</TableCell>
                <TableCell>
                  {new Date(g.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* CREATE GROUP */}
      <Fab
        color="primary"
        sx={{ position: "fixed", top: 80, right: 40 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Group</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Group Name *"
            value={form.group_name}
            onChange={(e) =>
              setForm({ ...form, group_name: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
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
