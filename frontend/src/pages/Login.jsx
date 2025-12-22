import { SignIn } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";

export default function Login() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Farmer System Login
      </Typography>

      <SignIn routing="path" path="/" redirectUrl="/home" />
    </Box>
  );
}
