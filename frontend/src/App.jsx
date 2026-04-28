import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import CreateGroups from "./pages/CreateGroup";
import Crops from "./pages/Crops";
import Lands from "./pages/Lands";
import Equipment from "./pages/Equipment";
import Farmers from "./pages/Farmers";
import AIQuery from "./pages/AIQuery";

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
                {/* Physically change the URL to /home if they are already logged in */}
                <Navigate to="/home" replace />
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
              <Groups />
            </SignedIn>
          }
        />

        <Route
          path="/groups"
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

        <Route
          path="/ai-query"
          element={
            <SignedIn>
              <AIQuery />
            </SignedIn>
          }
        />

        {/* Catch-all: If they hit a weird URL like /factor-one, safely bounce them to the root */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;