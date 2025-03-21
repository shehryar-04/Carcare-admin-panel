import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {

  FaChartBar,
  FaUsers,
  FaCar,
  FaMap,
  FaColumns,
  FaCalculator,
} from 'react-icons/fa';
import logo from './logo.png';

const Sidebar = ({ toggleSidebar }) => {
  const location = useLocation();

  // Menu Items
  const menuItems = [
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/vendors', icon: <FaUsers />, label: 'Vendors' },
    { path: '/serviceRequests', icon: <FaCar />, label: 'Service Request' },
    { path: '/maps', icon: <FaMap />, label: 'VendorMap' },
    { path: '/forms', icon: <FaColumns />, label: 'Forms' },
    { path: '/products', icon: <FaCalculator />, label: 'Products' },
    { path: '/Reports', icon: <FaChartBar />, label: 'reports' },
    { path: '/Admins', icon: <FaChartBar />, label: 'Admins' },
    { path: '/Service', icon: <FaChartBar />, label: 'Service Data' },
  ];

  // Charts Array
  const chartOptions = [
    { path: '/ServiceRequestData', label: 'Service Request Data' },
    { path: '/UsersByArea', label: 'Users By Area' },
    { path: '/ActiveUsers', label: 'User Activity' },
  ];

  return (
    <div className='sidebar text-white' style={{ background: '#255B82' }}>
      <div className='sidebar-header'>
        <img src={logo} alt="Logo" style={{ width: '100%', backgroundColor:'white'}} />
      </div>
      <Nav className='flex-column'>
        {/* Menu Items */}
        {menuItems.map((item) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? 'active' : ''
            }`}
            onClick={toggleSidebar}
          >
            {item.icon}
            <span className='ms-2'>{item.label}</span>
          </Nav.Link>
        ))}

        {/* Dropdown for Charts */}
        <Dropdown className='my-2'>
          <Dropdown.Toggle
            variant='link'
            className='text-white d-flex align-items-center dropdown-toggle'
            style={{ textDecoration: 'none' }}
          >
            <FaChartBar />
            <span className='ms-2'>Charts</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {chartOptions.map((chart) => (
              <Dropdown.Item as={Link} to={chart.path} key={chart.path}>
                {chart.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </div>
  );
};

export default Sidebar;
