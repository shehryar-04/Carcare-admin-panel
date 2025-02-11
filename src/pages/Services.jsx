import React, { useState, useEffect } from 'react';  
import { Table, Card, Button, Modal, Alert, Badge } from 'react-bootstrap';  
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';  
import { db } from '../config/firebase';  
import OpenCalendarModalButton from './costom-components/Button'; // Import the new button component  
  
const Services = () => {  
  const [requests, setRequests] = useState([]);  
  const [vendors, setVendors] = useState([]);  
  const [selectedRequest, setSelectedRequest] = useState(null);  
  const [showVendorsModal, setShowVendorsModal] = useState(false);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  
  useEffect(() => {  
    fetchRequests();  
    fetchVendors();  
  }, []);  
  
  const fetchRequests = async () => {  
    try {  
      const response = await fetch('https://carcarebaked.azurewebsites.net/api/service-request');  
      if (!response.ok) {  
        throw new Error('Failed to fetch service requests');  
      }  
      const requestsList = await response.json();  
      setRequests(requestsList);  
    } catch (error) {  
      console.error('Error fetching service requests:', error);  
      setError('Failed to fetch service requests');  
    }  
  };  
  
  const fetchVendors = async () => {  
    try {  
      const response = await fetch('https://carcarebaked.azurewebsites.net/api/vendors');  
      if (!response.ok) {  
        throw new Error('Failed to fetch vendors');  
      }  
      const vendorsList = await response.json();  
      setVendors(vendorsList);  
    } catch (error) {  
      console.error('Error fetching vendors:', error);  
      setError('Failed to fetch vendors');  
    }  
  };  
  
  const handleAssignVendor = async (requestId, vendorId) => {  
    try {  
      setError('');  
      setSuccess('');  
      const requestRef = doc(db, 'serviceRequests', requestId);  
      await updateDoc(requestRef, {  
        vendorId,  
        state: 'pending' // Update the status as needed  
      });  
  
      const vendor = vendors.find(v => v.id === vendorId);  
      const user = requests.find(r => r.id === requestId);  
  
      if (vendor && user) {  
        await sendNotification(vendor.fcmToken, 'New Service Request Assigned', 'You have been assigned a new service request.');  
        await sendNotification(user.fcmToken, 'Service Request Update', 'Your service request has been assigned to a new vendor.');  
      }  
  
      setSuccess('Service request successfully reassigned!');  
      setShowVendorsModal(false);  
      fetchRequests(); // Refresh the requests list  
    } catch (error) {  
      console.error('Error assigning vendor:', error);  
      setError('Failed to assign vendor to the request');  
    }  
  };  
  
  const sendNotification = async (fcmToken, title, body) => {  
    try {  
      const response = await fetch('https://carcarebaked.azurewebsites.net/api/send-notification-token', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          title,  
          body,  
          recipients: fcmToken  
        }),  
      });  
  
      if (!response.ok) {  
        throw new Error('Failed to send notification');  
      }  
  
      console.log('Notification sent successfully');  
    } catch (error) {  
      console.error('Error sending notification:', error);  
    }  
  };  
  
  const isRequestActive = (request) => {  
    if (!request.time) {  
      return false; // or true, depending on your preference  
    }  
  
    const now = new Date();  
    return request.dates.some(dateObj => {  
      if (!dateObj.date) return false; // Skip if no date  
      const [month, day, year] = dateObj.date.split('/').map(Number);  
      const requestDateTime = new Date(year < 100 ? year + 2000 : year, month - 1, day);  
      return requestDateTime > now; // Check if this date is in the future  
    });  
  };  
  
  const getFormattedTodayDate = () => {  
    const today = new Date();  
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based  
    const day = String(today.getDate()).padStart(2, '0');  
    const year = today.getFullYear();  
    return `${month}/${day}/${year}`;  
  };  
  
  const isTodayAvailable = (request) => {  
    const todayFormatted = getFormattedTodayDate();  
    return request.dates.some(dateObj => dateObj.date === todayFormatted);  
  };  
  
  return (  
    <div>  
      <h2 className="mb-4">Service Requests</h2>  
      {error && <Alert variant="danger">{error}</Alert>}  
      {success && <Alert variant="success">{success}</Alert>}  
      <Card className="table-responsive">  
        <Table striped bordered hover>  
          <thead>  
            <tr>  
              <th>Date</th>  
              <th>Time</th>  
              <th>Service</th>  
              <th>Vehicle</th>  
              <th>Area</th>  
              <th>Price</th>  
              <th>Status</th>  
              <th>Actions</th>  
              <th>Calendar</th> {/* Added a new column for the calendar */}  
            </tr>  
          </thead>  
          <tbody>  
            {requests.filter(isRequestActive).map((request) => (  
              <tr key={request.id}>  
                <td>{getFormattedTodayDate()}</td> {/* Display today's date */}  
                <td>{request.time}</td>  
                <td>{request.serviceName}</td>  
                <td>{request.vehicleNumber}</td>  
                <td>{request.area}</td>  
                <td>{request.price}</td>  
                <td>{request.state}</td>  
                <td>  
                  {request.state === 'cancelled' && (  
                    <Button  
                      variant="primary"  
                      size="sm"  
                      onClick={() => {  
                        setSelectedRequest(request);  
                        setShowVendorsModal(true);  
                      }}  
                    >  
                      Reassign  
                    </Button>  
                  )}  
                </td>  
                <td>  
                  {/* Use the OpenCalendarModalButton component */}  
                  <OpenCalendarModalButton requestId={request.id} />  
                  {console.log(request.id)}
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </Table>  
      </Card>  
      {/* Vendors Modal */}  
      <Modal  
        show={showVendorsModal}  
        onHide={() => setShowVendorsModal(false)}  
        size="lg"  
      >  
        <Modal.Header closeButton>  
          <Modal.Title>Select Vendor to Reassign</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <Table striped bordered hover>  
            <thead>  
              <tr>  
                <th>Name</th>  
                <th>Type</th>  
                <th>Area</th>  
                <th>Rating</th>  
                <th>Status</th>  
                <th>Services</th>  
                <th>Action</th>  
              </tr>  
            </thead>  
            <tbody>  
              {vendors.map((vendor) => (  
                <tr key={vendor.id}>  
                  <td>{vendor.displayName}</td>  
                  <td>{vendor.type}</td>  
                  <td>{vendor.area}</td>  
                  <td>{vendor.rating} ⭐</td>  
                  <td>  
                    <Badge bg={vendor.verification ? 'success' : 'warning'}>  
                      {vendor.verification ? 'Verified' : 'Pending'}  
                    </Badge>  
                  </td>  
                  <td>{vendor.services?.join(', ') || 'N/A'}</td>  
                  <td>  
                    <Button  
                      variant="success"  
                      size="sm"  
                      onClick={() => {  
                        if (selectedRequest) {  
                          handleAssignVendor(selectedRequest.id, vendor.id);  
                        } else {  
                          console.error('Selected request is null');  
                          setError('No service request selected');  
                        }  
                      }}  
                    >  
                      Accept  
                    </Button>  
                  </td>  
                </tr>  
              ))}  
            </tbody>  
          </Table>  
        </Modal.Body>  
      </Modal>  
    </div>  
  );  
};  
  
export default Services;  