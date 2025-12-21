import { SignIn } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";

export default function Login() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box>
        <Typography variant="h4" align="center" gutterBottom>
          Farmer System Login
        </Typography>
        <SignIn redirectUrl="/" />
      </Box>
    </Box>
  );
}
