import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Card, Row, Col, Badge, Container, ListGroup, Alert } from 'react-bootstrap';
import { haversineDistance } from '../utils/haversineDistance';

const VendorAvailability = ({ serviceRequestId, vendorId }) => {
  const [serviceRequest, setServiceRequest] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [vendorAssociation, setVendorAssociation] = useState(false);

  // Firebase subscriptions
  useEffect(() => {
    const unsubscribeService = onSnapshot(
      doc(db, 'serviceRequests', serviceRequestId),
      (doc) => {
        if (!doc.exists()) return;
        
        const requestData = doc.data();
        setServiceRequest(requestData);
        setVendorAssociation(requestData.vendorId === vendorId);
      },
      (error) => console.error('Service request error:', error)
    );
    
    return () => unsubscribeService();
  }, [serviceRequestId, vendorId]);

  useEffect(() => {
    if (!vendorAssociation) {
      setLoading(false);
      return;
    }

    const unsubscribeVendor = onSnapshot(
      doc(db, 'vendors', vendorId),
      (doc) => doc.exists() && setVendor(doc.data()),
      (error) => console.error('Vendor data error:', error)
    );
    
    return () => unsubscribeVendor();
  }, [vendorId, vendorAssociation]);

  // Process unavailable slots
  useEffect(() => {
    if (!vendorAssociation || !serviceRequest?.dates) return;

    const processedDates = serviceRequest.dates
      .map(d => ({
        date: d.date,
        time: serviceRequest.time,
        dateObj: new Date(d.date)
      }))
      .sort((a, b) => a.dateObj - b.dateObj);

    setUnavailableSlots(processedDates);
    setLoading(false);
  }, [serviceRequest, vendorAssociation]);

  if (loading) return <div className="text-center p-4">Loading availability...</div>;

  return (
    <Container className="py-4">
      {!vendorAssociation ? (
        <Alert variant="success" className="text-center">
          <i className="bi bi-check-circle me-2" />
          <h4>Vendor Available</h4>
          <p>No schedule conflicts detected</p>
        </Alert>
      ) : (
        <>
          <VendorHeader 
            vendor={vendor} 
            serviceRequest={serviceRequest} 
          />
          
          <ScheduleList 
            slots={unavailableSlots} 
            serviceTime={serviceRequest?.time} 
          />
        </>
      )}
    </Container>
  );
};

const VendorHeader = ({ vendor, serviceRequest }) => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <Card.Title as="h2" className="mb-3">
        {vendor?.displayName}
      </Card.Title>
      <Row>
        <Col md={6} className="mb-2">
          <span className="text-muted">
            <i className="bi bi-geo-alt me-1" />
            {vendor?.area} ({calculateDistance(vendor, serviceRequest)} km)
          </span>
        </Col>
        <Col md={6}>
          <span className="text-muted">
            <i className="bi bi-clock me-1" />
            Service Time: {serviceRequest?.time}
          </span>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const ScheduleList = ({ slots, serviceTime }) => (
  <Card className="shadow-sm">
    <Card.Body>
      <Card.Title as="h3" className="mb-4">
        <i className="bi bi-calendar-x me-2" />
        Booked Time Slots
      </Card.Title>

      {slots.length > 0 ? (
        <ListGroup>
          {slots.map((slot, index) => (
            <ListGroup.Item 
              key={index}
              className="d-flex justify-content-between align-items-center"
              variant="secondary"
            >
              <div>
                <strong>{slot.date}</strong>
                <div className="text-muted small">{serviceTime}</div>
              </div>
              <Badge bg="dark">
                <i className="bi bi-lock me-1" />
                Booked
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="success" className="text-center">
          <i className="bi bi-check-circle me-2" />
          No bookings found for this period
        </Alert>
      )}
    </Card.Body>
  </Card>
);

// Helper functions
const calculateDistance = (vendor, serviceRequest) => {
  if (!vendor?.location || !serviceRequest?.location) return 'N/A';
  
  return haversineDistance(
    serviceRequest.location.latitude,
    serviceRequest.location.longitude,
    vendor.location.latitude,
    vendor.location.longitude
  ).toFixed(2);
};

export default VendorAvailability;