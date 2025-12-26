import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@mui/material";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import {
  getGroupMembers,
  addMemberToGroup
} from "../api/groupMembers.api";

export default function Groups() {
  const { groupId } = useParams();

  const [members, setMembers] = useState([]);

  const currentFarmerId = Number(localStorage.getItem("farmer_id"));

  /* ================= FETCH MEMBERS ================= */
  const fetchMembers = async () => {
    try {
      const res = await getGroupMembers(groupId);
      setMembers(res.data.data);
    } catch (err) {
      console.error("Error fetching members", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  /* ================= JOIN GROUP ================= */
  const handleJoin = async () => {
    if (!currentFarmerId) {
      alert("Farmer not logged in");
      return;
    }

    try {
      await addMemberToGroup(groupId, currentFarmerId);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join group");
    }
  };

  /* ================= CHECK IF ALREADY MEMBER ================= */
  const alreadyJoined = members.some(
    (m) => Number(m.farmer_id) === currentFarmerId
  );

  return (
    <>
      <Navbar />

      <Box p={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">
            Group Members (Group ID: {groupId})
          </Typography>

          <Button
            variant="contained"
            disabled={alreadyJoined}
            onClick={handleJoin}
          >
            {alreadyJoined ? "Joined" : "Join Group"}
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Farmer ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.farmer_id}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.phone || "—"}</TableCell>
                <TableCell>{m.address || "—"}</TableCell>
                <TableCell>
                  {m.joined_at
                    ? new Date(m.joined_at).toLocaleString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
