import React, { useState, useEffect } from 'react';  
import { Table, Card, Button, Badge } from 'react-bootstrap';  
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';  
import { db } from '../config/firebase';  
  
const Vendors = () => {  
  const [vendors, setVendors] = useState([]);  
  
  useEffect(() => {  
    fetchVendors();  
  }, []);  
  
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
        await updateDoc(doc(db, 'vendors', vendorId), {  
          verification: true  
        });  
        await sendNotification('Vendor Verified', 'Your vendor verification has been approved.', fcmToken);  
      } else if (currentVerification && rating < 3) {  
        await updateDoc(doc(db, 'vendors', vendorId), {  
          verification: false  
        });  
        await sendNotification('Vendor Verification Cancelled', 'Your vendor verification has been revoked.', fcmToken);  
      }  
      fetchVendors();  
    } catch (error) {  
      console.error('Error updating vendor verification:', error);  
    }  
  };  
  
  const sendNotification = async (title, body, fcmToken) => {  
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
  
  // Sort vendors: Pending (verification: false) first  
  const sortedVendors = vendors.sort((a, b) => {  
    return (a.verification === b.verification) ? 0 : a.verification ? 1 : -1;  
  });  
  
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
              <th>Verification</th>  
              <th>Actions</th>  
            </tr>  
          </thead>  
          <tbody>  
            {sortedVendors.map((vendor) => (  
              <tr key={vendor.id}>  
                <td>{vendor.displayName}</td>  
                <td>{vendor.type}</td>  
                <td>{vendor.area}</td>  
                <td>{vendor.phoneNumber}</td>  
                <td>{vendor.credits}</td>  
                <td>{vendor.rating}</td>  
                <td>{vendor.CNIC}</td>  
                <td>  
                  {vendor.location ? `${vendor.location.latitude}, ${vendor.location.longitude}` : 'N/A'}  
                </td>  
                <td>{vendor.services?.join(', ') || 'N/A'}</td>  
                <td>  
                  <Badge bg={vendor.verification ? 'success' : 'warning'}>  
                    {vendor.verification ? 'Verified' : 'Pending'}  
                  </Badge>  
                </td>  
                <td>  
                  <Button  
                    variant={vendor.verification ? 'danger' : 'success'}  
                    size="sm"  
                    onClick={() => handleVerification(vendor.id, vendor.verification, vendor.rating, vendor.fcmToken)}  
                    disabled={(vendor.verification && vendor.rating >= 3)}  
                  >  
                    {vendor.verification ? 'Cancel Verification' : 'Verify'}  
                  </Button>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </Table>  
      </Card>  
    </div>  
  );  
};  
  
export default Vendors;  