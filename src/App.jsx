import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Services from "./pages/Services";
import Maps from "./pages/Maps";
import Forms from "./pages/form-layouts/index";
import Products from "./pages/Products";
import UsersByArea from "./pages/UsersByArea";
import ActiveUsers from "./pages/ActiveUsers";
import ServiceRequestData from "./pages/ServiceRequestData";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report from "./pages/Reports";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
          path="/vendors"
          element={
            <DashboardLayout>
              <Vendors />
            </DashboardLayout>
          }
        />
        <Route
          path="/services"
          element={
            <DashboardLayout>
              <Services />
            </DashboardLayout>
          }
        />
        <Route
          path="/Maps"
          element={
            <DashboardLayout>
              <Maps />
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
      </Routes>
    </Router>
  );
}

export default App;
