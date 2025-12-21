import Navbar from "../components/navbar";
import { Container, Typography } from "@mui/material";

const CreateGroup = () => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Create Group</Typography>
    </Container>
  </>
);

export default CreateGroup;
