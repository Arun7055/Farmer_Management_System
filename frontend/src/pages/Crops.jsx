import Navbar from "../components/navbar";
import { Container, Typography } from "@mui/material";

const Crops = () => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">My Crops</Typography>
    </Container>
  </>
);

export default Crops;
