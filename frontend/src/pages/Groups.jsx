import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import { getGroupMembers, addMemberToGroup } from "../api/groupMembers.api";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [farmerId, setFarmerId] = useState("");

  const fetchMembers = async () => {
    const res = await getGroupMembers();
    const filtered = res.data.filter(
      (m) => m.group_id === Number(groupId)
    );
    setMembers(filtered);
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const handleAdd = async () => {
    if (!farmerId) {
      alert("Farmer ID required");
      return;
    }

    await addMemberToGroup({
      farmer_id: Number(farmerId),
      group_id: Number(groupId)
    });

    setOpen(false);
    setFarmerId("");
    fetchMembers();
  };

  return (
    <>
      <Navbar />

      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Group Members (Group ID: {groupId})
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farmer ID</TableCell>
              <TableCell>Joined At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.farmer_id}</TableCell>
                <TableCell>
                  {new Date(m.joined_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Fab
        color="primary"
        sx={{ position: "fixed", top: 80, right: 40 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Member</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Farmer ID"
            type="number"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
