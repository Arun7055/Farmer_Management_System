import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  RedirectToUserProfile
} from "@clerk/clerk-react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import GroupDetails from "./pages/Groups";
import CreateGroups from "./pages/CreateGroup";
import Crops from "./pages/Crops";
import Lands from "./pages/Lands";
import Equipment from "./pages/Equipment";
import Farmers from "./pages/Farmers";

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

        <Route
          path="/farmers"
          element={
            <SignedIn>
              <Farmers />
            </SignedIn>
          }
        />

        {/* Groups */}
        <Route
          path="/groups/:groupId"
          element={
            <SignedIn>
              <GroupDetails />
            </SignedIn>
        }
        />

        {/* Create Group */}
        <Route
          path="/groups/create"
          element={
            <SignedIn>
              <CreateGroups />
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

        <Route
          path="/lands"
          element={
            <SignedIn>
              <Lands />
            </SignedIn>
          }
        />

        <Route
          path="/equipment"
          element={
            <SignedIn>
              <Equipment />
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
