import React, { useState, useEffect } from 'react';  
import { Table, Card, Button, Badge, Form, Modal } from 'react-bootstrap';  
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';  
import { db } from '../config/firebase';  
import VendorEarnings from './VendorEarnings';  
import VendorAvailability from './VendorAvailability';  
  
const Vendors = () => {  
  const [vendors, setVendors] = useState([]);  
  const [areas, setAreas] = useState([]);  
  const [editingVendor, setEditingVendor] = useState(null);  
  const [selectedVendor, setSelectedVendor] = useState(null);  
  const [showAvailability, setShowAvailability] = useState(false);  
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);  
  const [editedFields, setEditedFields] = useState({  
    credits: '',  
    services: '',  
    area: ''  
  });  
  
  useEffect(() => {  
    fetchVendors();  
    fetchAreas();  
  }, []);  
  
  const fetchAreas = async () => {  
    try {  
      const areasSnapshot = await getDocs(collection(db, 'areas'));  
      const areasList = areasSnapshot.docs.map(doc => doc.data().name);  
      setAreas(areasList);  
    } catch (error) {  
      console.error('Error fetching areas:', error);  
    }  
  };  
  
  const fetchVendors = async () => {  
    try {  
      const vendorsSnapshot = await getDocs(collection(db, 'vendors'));  
      const vendorsList = vendorsSnapshot.docs.map(doc => ({  
        id: doc.id,  
        ...doc.data()  
      }));  
      setVendors(vendorsList);  
    } catch (error) {  
      console.error('Error fetching vendors:', error);  
    }  
  };  
  
  const handleVerification = async (vendorId, currentVerification, rating, fcmToken) => {  
    try {  
      if (!currentVerification) {  
        await updateDoc(doc(db, 'vendors', vendorId), { verification: true });  
        await sendNotification('Vendor Verified', 'Your vendor verification has been approved.', fcmToken);  
      } else if (currentVerification && rating < 3) {  
        await updateDoc(doc(db, 'vendors', vendorId), { verification: false });  
        await sendNotification('Vendor Verification Cancelled', 'Your vendor verification has been revoked.', fcmToken);  
      }  
      fetchVendors();  
    } catch (error) {  
      console.error('Error updating vendor verification:', error);  
    }  
  };  
  
  const handleShowAvailability = (vendor) => {  
    setSelectedVendor(vendor.id);  
    setShowAvailability(true);  
  
    const relevantServiceRequest = findVendorServiceRequest(vendor.id);  
    setSelectedServiceRequest(relevantServiceRequest?.id);  
  };  
  
  const findVendorServiceRequest = (vendorId) => {  
    return { id: "JpygUNi7p5MFh0aAIePi" }; // Example hardcoded ID  
  };  
  
  const handleShowEarnings = (vendor) => {  
    setSelectedVendor(vendor.id);  
    setShowAvailability(false); // Ensure availability modal is closed  
  };  
  
  const sendNotification = async (title, body, fcmToken) => {  
    try {  
      const response = await fetch('https://backend.neurodude.co/api/send-notification-token', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ title, body, recipients: fcmToken }),  
      });  
      if (!response.ok) throw new Error('Failed to send notification');  
      console.log('Notification sent successfully');  
    } catch (error) {  
      console.error('Error sending notification:', error);  
    }  
  };  
  
  const startEditing = (vendor) => {  
    setEditingVendor(vendor.id);  
    setEditedFields({  
      credits: vendor.credits,  
      services: vendor.services?.join(', ') || '',  
      area: vendor.area || ''  
    });  
  };  
  
  const renderAreaField = (vendor) => {  
    if (editingVendor === vendor.id) {  
      return (  
        <Form.Select  
          value={editedFields.area}  
          onChange={(e) => handleFieldChange('area', e.target.value)}  
        >  
          <option value="">Select Area</option>  
          {areas.map((area, index) => (  
            <option key={index} value={area}>  
              {area}  
            </option>  
          ))}  
        </Form.Select>  
      );  
    }  
    return vendor.area;  
  };  
  
  const cancelEditing = () => {  
    setEditingVendor(null);  
    setEditedFields({ credits: '', services: '', area: '' });  
  };  
  
  const handleFieldChange = (field, value) => {  
    setEditedFields(prev => ({ ...prev, [field]: value }));  
  };  
  
  const saveChanges = async (vendorId) => {  
    if (!window.confirm('Are you sure you want to update this vendor?')) return;  
    try {  
      const updates = {  
        credits: Number(editedFields.credits),  
        services: editedFields.services.split(',').map(s => s.trim()),  
        area: editedFields.area  
      };  
      await updateDoc(doc(db, 'vendors', vendorId), updates);  
      await fetchVendors();  
      setEditingVendor(null);  
      alert('Vendor updated successfully!');  
    } catch (error) {  
      console.error('Error updating vendor:', error);  
      alert('Error updating vendor. Please try again.');  
    }  
  };  
  
  const sortedVendors = [...vendors].sort((a, b) =>  
    a.verification === b.verification ? 0 : a.verification ? 1 : -1  
  );  
  
  return (  
    <div className="p-3">  
      <h2 className="mb-4">Vendors Management</h2>  
      <Card className="table-responsive">  
        <Table striped bordered hover responsive>  
          <thead>  
            <tr>  
              <th>Name</th>  
              <th>Type</th>  
              <th>Area</th>  
              <th>Phone</th>  
              <th>Credits</th>  
              <th>Rating</th>  
              <th>CNIC</th>  
              <th>Location</th>  
              <th>Services</th>  
              <th>Completed Services</th>  
              <th>Verification</th>  
              <th>Actions</th>  
            </tr>  
          </thead>  
          <tbody>  
            {sortedVendors.map((vendor) => (  
              <tr key={vendor.id}>  
                <td>  
                  {vendor.displayName}  
                  <Badge bg={vendor.type === 'worker' ? 'info' : 'secondary'}>  
                    {vendor.type}  
                  </Badge>  
                </td>  
                <td>{vendor.type}</td>  
                <td>{renderAreaField(vendor)}</td>  
                <td>{vendor.phoneNumber}</td>  
                <td>  
                  {editingVendor === vendor.id ? (  
                    <Form.Control  
                      type="number"  
                      value={editedFields.credits}  
                      onChange={(e) => handleFieldChange('credits', e.target.value)}  
                    />  
                  ) : (  
                    vendor.credits  
                  )}  
                </td>  
                <td>{vendor.rating}</td>  
                <td>  
                  {vendor.CNIC}  
                  <br />  
                  {vendor.CNIC_back && (  
                    <a href={`https://backend.neurodude.co/api/image/${vendor.CNIC_back}`} target="_blank" rel="noopener noreferrer">  
                      CNIC Back  
                    </a>  
                  )}  
                  <br />  
                  {vendor.CNIC_front && (  
                    <a href={`https://backend.neurodude.co/api/image/${vendor.CNIC_front}`} target="_blank" rel="noopener noreferrer">  
                      CNIC Front  
                    </a>  
                  )}  
                </td>  
                <td>  
                  {vendor.location ? `${vendor.location.latitude}, ${vendor.location.longitude}` : 'N/A'}  
                </td>  
                <td>  
                  {editingVendor === vendor.id ? (  
                    <Form.Control  
                      value={editedFields.services}  
                      onChange={(e) => handleFieldChange('services', e.target.value)}  
                    />  
                  ) : (  
                    vendor.services?.join(', ') || 'N/A'  
                  )}  
                </td>  
                <td>{vendor.completedRequests || 'N/A'}</td>  
                <td>  
                  <Badge bg={vendor.verification ? 'success' : 'warning'}>  
                    {vendor.verification ? 'Verified' : 'Pending'}  
                  </Badge>  
                </td>  
                <td>  
                  <div className="d-flex gap-2 flex-wrap">  
                    <Button  
                      variant={vendor.verification ? 'danger' : 'success'}  
                      size="sm"  
                      onClick={() => handleVerification(  
                        vendor.id,  
                        vendor.verification,  
                        vendor.rating,  
                        vendor.fcmToken  
                      )}  
                      disabled={vendor.verification && vendor.rating >= 3}  
                    >  
                      {vendor.verification ? 'Cancel Verification' : 'Verify'}  
                    </Button>  
                    <Button  
                      variant="info"  
                      size="sm"  
                      onClick={() => handleShowEarnings(vendor)}  
                    >  
                      Earnings  
                    </Button>  
                    {editingVendor === vendor.id ? (  
                      <>  
                        <Button variant="success" size="sm" onClick={() => saveChanges(vendor.id)}>  
                          Save  
                        </Button>  
                        <Button variant="secondary" size="sm" onClick={cancelEditing}>  
                          Cancel  
                        </Button>  
                      </>  
                    ) : (  
                      <Button variant="primary" size="sm" onClick={() => startEditing(vendor)}>  
                        Edit  
                      </Button>  
                    )}  
                    <Button  
                      variant="warning"  
                      size="sm"  
                      onClick={() => handleShowAvailability(vendor)}  
                    >  
                      Availability  
                    </Button>  
                  </div>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </Table>  
      </Card>  
            <Modal
        show={showAvailability}
        onHide={() => {
          setShowAvailability(false);
          setSelectedVendor(null); // This line is added
        }}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Vendor Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && selectedServiceRequest && (
            <VendorAvailability
              serviceRequestId={selectedServiceRequest}
              vendorId={selectedVendor}
            />
          )}
        </Modal.Body>
      </Modal>
      <Modal  
        show={!!selectedVendor && !showAvailability} // Show only if availability modal is not open  
        onHide={() => setSelectedVendor(null)}  
        size="lg"  
      >  
        <Modal.Header closeButton>  
          <Modal.Title>Vendor Earnings</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          {selectedVendor && <VendorEarnings vendorId={selectedVendor} />}  
        </Modal.Body>  
      </Modal>  
    </div>  
  );  
};  
  
export default Vendors;  