import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  RedirectToUserProfile
} from "@clerk/clerk-react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import Crops from "./pages/Crops";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <Login />
              </SignedOut>
              <SignedIn>
                <Home />
              </SignedIn>
            </>
          }
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            <SignedIn>
              <Home />
            </SignedIn>
          }
        />

        {/* Groups */}
        <Route
          path="/groups"
          element={
            <SignedIn>
              <Groups />
            </SignedIn>
          }
        />

        {/* Create Group */}
        <Route
          path="/groups/create"
          element={
            <SignedIn>
              <CreateGroup />
            </SignedIn>
          }
        />

        {/* Crops */}
        <Route
          path="/crops"
          element={
            <SignedIn>
              <Crops />
            </SignedIn>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn routing="path" path="/" />
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
