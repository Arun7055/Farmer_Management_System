import Navbar from "../components/navbar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api"; // change if needed

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState(null);

  const cards = [
    { title: "My Groups", path: "/groups" },
    { title: "Crops", path: "/crops" },
    { title: "My Lands", path: "/lands" },
    { title: "Equipment", path: "/equipment" },
    { title: "Create Group", path: "/groups/create" }
  ];

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncFarmer = async () => {
      try {
        // 1️⃣ Try fetching farmer by Clerk ID
        const res = await axios.get(
          `${API_BASE}/farmers/by-clerk/${user.id}`
        );
        setFarmer(res.data.data);
        setLoading(false);
      } catch (err) {
        // 2️⃣ If not found → create farmer
        if (err.response && err.response.status === 404) {
          try {
            const createRes = await axios.post(
              `${API_BASE}/farmers`,
              {
                clerk_user_id: user.id,
                name: user.fullName || user.username || "Farmer",
                phone: user.phoneNumbers?.[0]?.phoneNumber || null,
                address: null
              }
            );
            setFarmer(createRes.data.data);
          } catch (createErr) {
            console.error("Error creating farmer:", createErr);
          }
        } else {
          console.error("Error fetching farmer:", err);
        }
        setLoading(false);
      }
    };

    syncFarmer();
  }, [isLoaded, user]);

  /* =========================
     Loading state
  ========================= */
  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {farmer && (
          <Typography variant="subtitle1" gutterBottom>
            Welcome, <b>{farmer.name}</b>
          </Typography>
        )}

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { boxShadow: 6 }
                }}
                onClick={() => navigate(card.path)}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
