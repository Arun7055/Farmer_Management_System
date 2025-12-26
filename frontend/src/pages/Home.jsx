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
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea"
    },
    {
      title: "Lands",
      subtitle: "Your & shared lands",
      path: "/lands",
      icon: <AgricultureIcon sx={{ fontSize: 48 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f5576c"
    },
    {
      title: "Crops",
      subtitle: "Active cultivations",
      path: "/crops",
      icon: <SpaIcon sx={{ fontSize: 48 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#00f2fe"
    },
    {
      title: "Equipment",
      subtitle: "Tools & machinery",
      path: "/equipment",
      icon: <BuildIcon sx={{ fontSize: 48 }} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      color: "#43e97b"
    },
    {
      title: "Farmers",
      subtitle: "Network & connect",
      path: "/farmers",
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      color: "#fa709a"
    }
  ];

  return (
    <>
      <Navbar />

      <Box sx={{
        p: 4,
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, rgba(76, 175, 80, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(255, 193, 7, 0.05) 0%, transparent 50%)"
      }}>
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Dashboard
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Manage your farming activities, collaborate with groups and track resources
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Card
                onClick={() => navigate(card.path)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: 4,
                  background: "linear-gradient(135deg, rgba(20, 27, 45, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${card.color}`,
                    border: `1px solid ${card.color}`,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: card.gradient,
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.4s",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                  },
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(30px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    py: 5,
                    px: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: card.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.4s",
                      boxShadow: `0 8px 16px ${card.color}40`,
                      ".MuiCard-root:hover &": {
                        transform: "rotate(360deg) scale(1.1)",
                        boxShadow: `0 12px 24px ${card.color}60`,
                      },
                    }}
                  >
                    <Box sx={{ color: "#fff" }}>
                      {card.icon}
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", lineHeight: 1.6 }}
                  >
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
