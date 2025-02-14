// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";

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
  const [loading, setLoading] = useState(true);

  // Fetch the admin's role from Firestore once authenticated
  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated && auth.currentUser) {
        try {
          const docRef = doc(db, "admins", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fetchedRole = docSnap.data().role;
            console.log("Fetched role:", fetchedRole); // Debugging output
            setRole(fetchedRole);
          } else {
            console.error("No admin document found!");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
      setLoading(false);
    };

    fetchRole();
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {/* Routes available to all authenticated users */}
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
          {/* Owner-only Routes wrapped with RoleBasedRoute */}
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
                {/* <RoleBasedRoute allowedRoles={["owner"]} role={role}> */}
                  <Forms />
                {/* </RoleBasedRoute> */}
              </DashboardLayout>
            }
          />
          <Route
            path="/Admins"
            element={
              <DashboardLayout>
                {/* <RoleBasedRoute allowedRoles={["owner"]} role={role}> */}
                  <Admins />
                {/* </RoleBasedRoute> */}
              </DashboardLayout>
            }
          />
          <Route
            path="/Products"
            element={
              <DashboardLayout>
                {/* <RoleBasedRoute allowedRoles={["owner"]} role={role}> */}
                  <Products />
                {/* </RoleBasedRoute> */}
              </DashboardLayout>
            }
          />
          <Route
            path="/UsersByArea"
            element={
              <DashboardLayout>
                <RoleBasedRoute allowedRoles={["owner"]} role={role}>
                  <UsersByArea />
                </RoleBasedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/ActiveUsers"
            element={
              <DashboardLayout>
                <RoleBasedRoute allowedRoles={["owner"]} role={role}>
                  <ActiveUsers />
                </RoleBasedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/ServiceRequestData"
            element={
              <DashboardLayout>
                <RoleBasedRoute allowedRoles={["owner"]} role={role}>
                  <ServiceRequestData />
                </RoleBasedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/Reports"
            element={
              <DashboardLayout>
                <RoleBasedRoute allowedRoles={["owner"]} role={role}>
                  <Report />
                </RoleBasedRoute>
              </DashboardLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
