import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import AccessDenied from "./components/AccessDenied";
import { hasPermission } from './config/roleConfig';

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
          
          // Set default verification to true if user is authenticated
          let userVerification = true;
          let fetchedRole = null;

          if (docSnap.exists()) {
            // Only override verification if explicitly set to false in database
            userVerification = docSnap.data().verification !== false;
            fetchedRole = docSnap.data().role;
            console.log("Fetched role:", fetchedRole);
            console.log("User verification:", userVerification);
          } else {
            console.log("No admin document found - using default verification");
          }
          
          setRole(fetchedRole);
          setVerification(userVerification);
        } catch (error) {
          console.error("Error fetching role:", error);
          // Default to true on error to prevent lockout
          setVerification(true);
        }
      } else {
        setVerification(false);
      }
      setLoading(false);
    };

    fetchRole();
  }, [isAuthenticated]);

  const canAccessRoute = (path) => {
    // Remove leading slash and get the first segment of the path
    const route = path.replace(/^\//, '').split('/')[0] || 'dashboard';
    return hasPermission(role, route);
  };

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
            <>
              {/* Map through your routes and check permissions */}
              {[
                { path: '/', element: <Dashboard /> },
                { path: '/dashboard', element: <Dashboard /> },
                { path: '/serviceRequests', element: <ServiceRequests /> },
                { path: '/maps', element: <Maps /> },
                { path: '/Service', element: <Services /> },
                { path: '/vendors', element: <Vendors /> },
                { path: '/Forms', element: <Forms /> },
                { path: '/Admins', element: <Admins /> },
                { path: '/Products', element: <Products /> },
                { path: '/UsersByArea', element: <UsersByArea /> },
                { path: '/ActiveUsers', element: <ActiveUsers /> },
                { path: '/ServiceRequestData', element: <ServiceRequestData /> },
                { path: '/Reports', element: <Report /> },
              ].map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    canAccessRoute(path) ? (
                      <DashboardLayout>{element}</DashboardLayout>
                    ) : (
                      <AccessDenied />
                    )
                  }
                />
              ))}
            </>
          ) : (
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
