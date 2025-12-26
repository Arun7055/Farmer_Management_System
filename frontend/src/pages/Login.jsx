import { SignIn } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";

export default function Login() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: "radial-gradient(ellipse at top, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(255, 193, 7, 0.1) 0%, transparent 50%)",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={4}
      >
        <AgricultureIcon
          sx={{
            fontSize: 60,
            color: "#4caf50",
          }}
        />
        <Typography
          variant="h3"
          sx={{
            background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}
        >
          Farmer System
        </Typography>
      </Box>

      <SignIn routing="path" path="/" redirectUrl="/home" />
    </Box>
  );
}
