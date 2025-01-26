import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Services from './pages/Services';
import Transactions from './pages/Transactions';
import Settings from './pages/form-layouts/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />
        <Route path="/vendors" element={
          <DashboardLayout>
            <Vendors />
          </DashboardLayout>
        } />
        <Route path="/services" element={
          <DashboardLayout>
            <Services />
          </DashboardLayout>
        } />
        <Route path="/transactions" element={
          <DashboardLayout>
            <Transactions />
          </DashboardLayout>
        } />
        <Route path="/settings" element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;