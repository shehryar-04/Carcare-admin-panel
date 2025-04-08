import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import IncomeChart from './IncomeChart';
import { User, FileText, Activity } from 'react-feather';
import Loading from '../assets/loading.gif'
import Lottie from 'lottie-react'
import Loader from '../assets/Loading.json'

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
        {/* Total Users Card */}
        <Col md={3}>
          <Card className="dashboard-card" style={{ backgroundImage: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
            <Card.Body style={{ color: 'white' }}>
              <Row className="align-items-center">
                <Col xs={4}>
                  <User size={40} color="white" />
                </Col>
                <Col xs={8}>
                  <h5>Total Users</h5>
                  <h2>{stats.totalUsers}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Vendors Card */}
        <Col md={3}>
          <Card className="dashboard-card" style={{ backgroundImage: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' }}>
            <Card.Body style={{ color: 'white' }}>
              <Row className="align-items-center">
                <Col xs={4}>
                  <User size={40} color="white" />
                </Col>
                <Col xs={8}>
                  <h5>Total Vendors</h5>
                  <h2>{stats.totalVendors}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Requests Card */}
        <Col md={3}>
          <Card className="dashboard-card" style={{ backgroundImage: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }}>
            <Card.Body style={{ color: 'white' }}>
              <Row className="align-items-center">
                <Col xs={4}>
                  <FileText size={40} color="white" />
                </Col>
                <Col xs={8}>
                  <h5>Total Requests</h5>
                  <h2>{stats.totalRequests}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Active Requests Card */}
        <Col md={3}>
          <Card className="dashboard-card" style={{ backgroundImage: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)' }}>
            <Card.Body style={{ color: 'white' }}>
              <Row className="align-items-center">
                <Col xs={4}>
                  <Activity size={40} color="white" />
                </Col>
                <Col xs={8}>
                  <h5>Active Requests</h5>
                  <h2>{stats.activeRequests}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} style={{ marginTop: 20 }}>
          <Card className="dashboard-card">
            <Card.Body>
              <IncomeChart/>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} style={{ marginTop: 20 }}>
          <Card className="dashboard-card">
            <Card.Body>
              <Lottie animationData={Loader}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;