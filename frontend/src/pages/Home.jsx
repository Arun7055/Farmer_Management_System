import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from "@mui/material";

import Navbar from "../components/navbar";
import api from "../api/axios";

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  /* ================= CLERK → FARMER SYNC ================= */
  useEffect(() => {
    if (!isLoaded || !user) return;

    const clerkId = user.id;

    console.log("🔑 Clerk User ID:", clerkId);

    const syncFarmer = async () => {
      try {
        const res = await api.get(`/farmers/clerk/${clerkId}`);

        if (res.status === 200 && res.data && res.data.data) {
          const farmer = res.data.data;

          console.log("🌾 Farmer from DB:", farmer);

          if (farmer?.id) {
            localStorage.setItem("farmer_id", farmer.id.toString());

            console.log(
              "✅ Stored farmer_id in localStorage:",
              localStorage.getItem("farmer_id")
            );
          } else {
            console.warn("⚠️ Farmer ID is missing in the response.");
          }
        } else {
          console.warn("⚠️ Unexpected response format or status:", res);
        }
      } catch (err) {
        if (err.response) {
          console.error(
            "❌ Failed to sync farmer - API responded with:",
            err.response.status,
            err.response.data
          );
        } else {
          console.error("❌ Failed to sync farmer - Network or other error:", err);
        }
      }
    };

    syncFarmer();
  }, [isLoaded, user]);

  /* ================= DASHBOARD CARDS ================= */
  const cards = [
    { title: "My Groups", path: "/groups" },
    { title: "Lands", path: "/lands" },
    { title: "Crops", path: "/crops" },
    { title: "Equipment", path: "/equipment" },
    { title: "Farmers", path: "/farmers" }
  ];

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

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
