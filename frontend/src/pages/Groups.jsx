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
import StyledTable from "../components/StyledTable";
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

      <Box p={4} sx={{ minHeight: "100vh" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700
            }}
          >
            Group Members (ID: {groupId})
          </Typography>

          <Button
            variant="contained"
            disabled={alreadyJoined}
            onClick={handleJoin}
            sx={{
              px: 4,
              py: 1.5,
              background: alreadyJoined
                ? "rgba(76, 175, 80, 0.3)"
                : "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
              boxShadow: alreadyJoined
                ? "none"
                : "0 4px 12px rgba(76, 175, 80, 0.3)",
              transition: "all 0.3s",
              "&:hover": alreadyJoined
                ? {}
                : {
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                  },
            }}
          >
            {alreadyJoined ? "Joined" : "Join Group"}
          </Button>
        </Box>

        <StyledTable>
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
        </StyledTable>
      </Box>
    </>
  );
}
