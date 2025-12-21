import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import Crops from "./pages/Crops";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <SignedIn>
              <Home />
            </SignedIn>
          }
        />

        <Route
          path="/groups"
          element={
            <SignedIn>
              <Groups />
            </SignedIn>
          }
        />

        <Route
          path="/groups/create"
          element={
            <SignedIn>
              <CreateGroup />
            </SignedIn>
          }
        />

        <Route
          path="/crops"
          element={
            <SignedIn>
              <Crops />
            </SignedIn>
          }
        />

        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
