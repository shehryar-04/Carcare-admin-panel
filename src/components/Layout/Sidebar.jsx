import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaCar, FaMoneyBillWave, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/vendors', icon: <FaUsers />, label: 'Vendors' },
    { path: '/services', icon: <FaCar />, label: 'Services' },
    { path: '/transactions', icon: <FaMoneyBillWave />, label: 'Maps' },
    { path: '/settings', icon: <FaCog />, label: 'Forms' },
  ];

  return (
    <div className="sidebar text-white" style={{ background: '#255B82' }}>
      <div className="sidebar-header p-3">
        <h3>Car Services Admin</h3>
      </div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span className="ms-2">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;