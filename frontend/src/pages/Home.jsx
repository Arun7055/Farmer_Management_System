import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SpaIcon from "@mui/icons-material/Spa";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";

import Navbar from "../components/navbar";
import api from "../api/axios";

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  /* ================= STATE ================= */
  const [needsProfile, setNeedsProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    email: ""
  });

  /* ================= CLERK → FARMER SYNC (UNCHANGED) ================= */
  useEffect(() => {
    if (!isLoaded || !user) return;

    const clerkId = user.id;

    const syncFarmer = async () => {
      try {
        const res = await api.get(`/farmers/clerk/${clerkId}`);
        const farmer = res.data.data;

        if (farmer?.id) {
          localStorage.setItem("farmer_id", farmer.id.toString());
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileForm({
            name: user.fullName || "",
            phone: "",
            email: user.primaryEmailAddress?.emailAddress || ""
          });
          setNeedsProfile(true);
        }
      }
    };

    syncFarmer();
  }, [isLoaded, user]);

  /* ================= DASHBOARD CARDS ================= */
  const cards = [
    {
      title: "Groups",
      subtitle: "Farmer communities",
      path: "/groups",
      icon: <GroupsIcon fontSize="large" />
    },
    {
      title: "Lands",
      subtitle: "Your & shared lands",
      path: "/lands",
      icon: <AgricultureIcon fontSize="large" />
    },
    {
      title: "Crops",
      subtitle: "Active cultivations",
      path: "/crops",
      icon: <SpaIcon fontSize="large" />
    },
    {
      title: "Equipment",
      subtitle: "Tools & machinery",
      path: "/equipment",
      icon: <BuildIcon fontSize="large" />
    },
    {
      title: "Farmers",
      subtitle: "Network & connect",
      path: "/farmers",
      icon: <PeopleIcon fontSize="large" />
    }
  ];

  return (
    <>
      <Navbar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Manage your farming activities, collaborate with groups and track resources
        </Typography>

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Card
                onClick={() => navigate(card.path)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: 3,
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    py: 4
                  }}
                >
                  {card.icon}
                  <Typography variant="h6" fontWeight={600}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= COMPLETE PROFILE DIALOG (UNCHANGED) ================= */}
      <Dialog open={needsProfile} disableEscapeKeyDown>
        <DialogTitle>Complete Your Profile</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="Email"
            value={profileForm.email}
            disabled
          />

          <TextField
            fullWidth
            margin="dense"
            label="Phone Number *"
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phone: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={async () => {
              if (!profileForm.phone) {
                alert("Phone number is required");
                return;
              }

              const res = await api.post("/farmers", {
                clerk_user_id: user.id,
                name: profileForm.name,
                phone: profileForm.phone,
                address: profileForm.email
              });

              localStorage.setItem(
                "farmer_id",
                res.data.data.id.toString()
              );

              setNeedsProfile(false);
            }}
          >
            Save & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
