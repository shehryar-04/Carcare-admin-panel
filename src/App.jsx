import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import AccessDenied from "./components/AccessDenied";

// Layout and Route Components
import DashboardLayout from "./components/Layout/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import ServiceRequests from "./pages/ServiceRequests";
import Maps from "./pages/Maps";
import Forms from "./pages/form-layouts/index";
import Products from "./pages/Products";
import UsersByArea from "./pages/UsersByArea";
import ActiveUsers from "./pages/ActiveUsers";
import ServiceRequestData from "./pages/ServiceRequestData";
import Report from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admins from "./pages/Admins";
import Services from "./pages/ServiceData";

// Global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

// Import the RoleBasedRoute component
import RoleBasedRoute from "./components/RoleProtected";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [role, setRole] = useState(null);
  const [verification, setVerification] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated && auth.currentUser) {
        try {
          const docRef = doc(db, "admins", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userVerification = docSnap.data().verification;
            const fetchedRole = docSnap.data().role;
            console.log("Fetched role:", fetchedRole);
            console.log("User verification:", userVerification);
            setRole(fetchedRole);
            setVerification(userVerification);
          } else {
            console.error("No admin document found!");
            setVerification(false); // Assume unverified if no data exists
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setVerification(false); // Default to false on error
        }
      }
      setLoading(false);
    };

    fetchRole();
  }, [isAuthenticated]);

  // 🔄 **Show loading screen while checking user data**
  if (loading) {
    return <div style={styles.loadingContainer}>Checking Permissions...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {verification ? (
            // ✅ Verified users get access to the full dashboard
            <>
              <Route
                path="/"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/serviceRequests"
                element={
                  <DashboardLayout>
                    <ServiceRequests />
                  </DashboardLayout>
                }
              />
              <Route
                path="/maps"
                element={
                  <DashboardLayout>
                    <Maps />
                  </DashboardLayout>
                }
              />
              <Route
                path="/Service"
                element={
                  <DashboardLayout>
                    <Services />
                  </DashboardLayout>
                }
              />
              <Route
                path="/vendors"
                element={
                  <DashboardLayout>
                    <Vendors />
                  </DashboardLayout>
                }
              />
              <Route
                path="/Forms"
                element={
                  <DashboardLayout>
                    <Forms />
                  </DashboardLayout>
                }
              />
              <Route
                path="/Admins"
                element={
                  <DashboardLayout>
                    <Admins />
                  </DashboardLayout>
                }
              />
              <Route
                path="/Products"
                element={
                  <DashboardLayout>
                    <Products />
                  </DashboardLayout>
                }
              />
              <Route
                path="/UsersByArea"
                element={
                  <DashboardLayout>
                    <UsersByArea />
                  </DashboardLayout>
                }
              />
              <Route
                path="/ActiveUsers"
                element={
                  <DashboardLayout>
                    <ActiveUsers />
                  </DashboardLayout>
                }
              />
              <Route
                path="/ServiceRequestData"
                element={
                  <DashboardLayout>
                    <ServiceRequestData />
                  </DashboardLayout>
                }
              />
              <Route
                path="/Reports"
                element={
                  <DashboardLayout>
                    <Report />
                  </DashboardLayout>
                }
              />
            </>
          ) : (
            // ❌ Unverified users get denied access to everything
            <Route path="*" element={<AccessDenied />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}

// Styling for the loading screen
const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

export default App;
