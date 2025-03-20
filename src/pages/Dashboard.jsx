import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import IncomeChart from './IncomeChart'
import VideoComponet from './Videocomponent'
// import App from './UsersByArea'
// import ServiceRequestData from './ServiceRequestData';
// import ActiveUsers from './ActiveUsers';
// import Products from './Products';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalRequests: 0,
    activeRequests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, vendorsSnap, requestsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'vendors')),
          getDocs(collection(db, 'serviceRequests'))
        ]);

        const activeRequests = requestsSnap.docs.filter(
          doc => doc.data().state !== 'cancelled' && doc.data().state !== 'completed'
        );

        setStats({
          totalUsers: usersSnap.size,
          totalVendors: vendorsSnap.size,
          totalRequests: requestsSnap.size,
          activeRequests: activeRequests.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      <Row>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Total Vendors</h5>
              <h2>{stats.totalVendors}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Total Requests</h5>
              <h2>{stats.totalRequests}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <h5>Active Requests</h5>
              <h2>{stats.activeRequests}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="dashboard-card">
            <Card.Body>
             <IncomeChart/>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="dashboard-card">
            <Card.Body>
             <VideoComponet/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
     
    </div>
  );
};

export default Dashboard;