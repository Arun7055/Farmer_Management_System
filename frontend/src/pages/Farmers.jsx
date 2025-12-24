import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import Navbar from "../components/navbar";
  import { getAllFarmers } from "../api/farmers.api";
  
  export default function Farmers() {
    const [farmers, setFarmers] = useState([]);
  
    useEffect(() => {
      fetchFarmers();
    }, []);
  
    const fetchFarmers = async () => {
      const res = await getAllFarmers();
      setFarmers(res.data);
    };
  
    return (
      <>
        <Navbar />
  
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Farmers
          </Typography>
  
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
              {farmers.map((f) => (
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
            </TableBody>
          </Table>
        </Box>
      </>
    );
  }
  