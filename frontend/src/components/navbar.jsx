import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Farmer System
        </Typography>

        <Button color="inherit" onClick={() => navigate("/groups")}>
          Groups
        </Button>

        <Button color="inherit" onClick={() => navigate("/farmers")}>
          Farmers
        </Button>

        <Button color="inherit" onClick={() => navigate("/lands")}>
          Lands
        </Button>

        <Button color="inherit" onClick={() => navigate("/equipment")}>
          Equipment
        </Button>

        <Button color="inherit" onClick={() => navigate("/crops")}>
          Crops
        </Button>

        <Button color="inherit" onClick={() => signOut()}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
