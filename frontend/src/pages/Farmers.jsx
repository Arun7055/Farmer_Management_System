import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import Navbar from "../components/navbar";
  import { getAllFarmers } from "../api/farmers.api";
  
  export default function Farmers() {
    const [farmers, setFarmers] = useState([]);
  
    /* ===== FILTER STATES ===== */
    const [nameFilter, setNameFilter] = useState("");
    const [phoneFilter, setPhoneFilter] = useState("");
    const [addressFilter, setAddressFilter] = useState("");
  
    useEffect(() => {
      fetchFarmers();
    }, []);
  
    const fetchFarmers = async () => {
      const res = await getAllFarmers();
      setFarmers(res.data);
    };
  
    /* ===== FILTER LOGIC ===== */
    const filteredFarmers = farmers.filter((f) => {
      return (
        (!nameFilter ||
          f.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
        (!phoneFilter || (f.phone || "").includes(phoneFilter)) &&
        (!addressFilter ||
          (f.address || "")
            .toLowerCase()
            .includes(addressFilter.toLowerCase()))
      );
    });
  
    return (
      <>
        <Navbar />
  
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Farmers
          </Typography>
  
          {/* ---------- FILTERS ---------- */}
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
  
            <TextField
              label="Phone"
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
            />
  
            <TextField
              label="Address"
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
            />
          </Box>
  
          {/* ---------- TABLE ---------- */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Clerk User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {filteredFarmers.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.clerk_user_id}</TableCell>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.phone || "—"}</TableCell>
                  <TableCell>{f.address || "—"}</TableCell>
                  <TableCell>
                    {new Date(f.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
  
              {filteredFarmers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No farmers match the filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  }
  