import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { List, X } from 'react-feather';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const isMobile = () => window.innerWidth < 768;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(!isMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    if (isMobile()) setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='dashboard-container'>
      {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
      <div className='main-content'>
        <header className='header'>
          {/* Sidebar toggle button, visible only on small screens via CSS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <button className='sidebar-toggle' onClick={toggleSidebar}>
              {sidebarOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
          <Header />
        </header>
        <Container fluid className='py-4'>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
