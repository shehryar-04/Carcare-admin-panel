import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { List, X } from 'react-feather';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  // State to control sidebar visibility on small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <Sidebar />
      </div>
      <div className="main-content">
        <header className="header">
          {/* Sidebar toggle button, visible only on small screens via CSS */}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={24} /> : <List size={24} />}
          </button>
          <Header />
        </header>
        <Container fluid className="py-4">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;