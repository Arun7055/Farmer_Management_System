import Navbar from "../components/navbar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    { title: "My Groups", path: "/groups" },
    { title: "Crops", path: "/crops" },
    { title: "Create Group", path: "/groups/create" }
  ];

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
                  "&:hover": {
                    boxShadow: 6
                  }
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
