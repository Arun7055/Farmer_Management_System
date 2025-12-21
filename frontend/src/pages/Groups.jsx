import Navbar from "../components/navbar";
import { Container, Typography } from "@mui/material";

const Groups = () => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">My Groups</Typography>
    </Container>
  </>
);

export default Groups;
