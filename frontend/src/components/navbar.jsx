import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AgricultureIcon from "@mui/icons-material/Agriculture";

export default function Navbar() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, rgba(20, 27, 45, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        borderBottom: "1px solid rgba(76, 175, 80, 0.2)",
      }}
    >
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" }
          }}
          onClick={() => navigate("/")}
        >
          <AgricultureIcon sx={{ color: "#4caf50" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
            Farmer System
          </Typography>
        </Box>

        {[
          { label: "Groups", path: "/groups" },
          { label: "Farmers", path: "/farmers" },
          { label: "Lands", path: "/lands" },
          { label: "Equipment", path: "/equipment" },
          { label: "Crops", path: "/crops" },
          { label: "AI Query", path: "/ai-query" },
        ].map((item) => (
          <Button
            key={item.label}
            color="inherit"
            onClick={() => navigate(item.path)}
            sx={{
              mx: 0.5,
              px: 2,
              transition: "all 0.3s",
              position: "relative",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.15)",
                transform: "translateY(-2px)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: "2px",
                backgroundColor: "#4caf50",
                transition: "width 0.3s",
              },
              "&:hover::after": {
                width: "80%",
              },
            }}
          >
            {item.label}
          </Button>
        ))}

        <Button
          color="inherit"
          onClick={() => signOut()}
          sx={{
            ml: 2,
            px: 3,
            backgroundColor: "rgba(244, 67, 54, 0.15)",
            border: "1px solid rgba(244, 67, 54, 0.3)",
            transition: "all 0.3s",
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.25)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
