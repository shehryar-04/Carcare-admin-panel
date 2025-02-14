import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');

  // Fetch admins from Firebase Firestore
  const fetchAdmins = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminData);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to fetch admins');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle verification toggle
  const handleVerificationToggle = async (admin) => {
    try {
      const adminRef = doc(db, "admins", admin.id);
      await updateDoc(adminRef, {
        verification: !admin.verification
      });
      setAdmins(admins.map(a => a.id === admin.id ? { ...a, verification: !a.verification } : a));
    } catch (error) {
      console.error('Error updating admin:', error);
      setError('Failed to update admin verification');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {/* <th>Name</th> */}
            <th>Email</th>
            <th>verification</th>
            <th>Actions</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.id}>
                {/* <td>{admin.name}</td> */}
                <td>{admin.email}</td>
                <td>{admin.verification ? 'Yes' : 'No'}</td>
                <td>
                  <Button 
                    variant={admin.verification ? "danger" : "success"} 
                    onClick={() => handleVerificationToggle(admin)}
                  >
                    {admin.verification ? 'Unverify' : 'Verify'}
                  </Button>
                </td>
                <td>{admin.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Loading admins...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Admins;
