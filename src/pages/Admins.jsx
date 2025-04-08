import React, { useState, useEffect } from 'react';
import { Table, Button, Alert,Form } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ROLES } from '../config/roleConfig';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.SUB_ADMIN);
  const [inviteSuccess, setInviteSuccess] = useState('');

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
  const handleRoleChange = async (admin, newRole) => {
    try {
      const adminRef = doc(db, "admins", admin.id);
      await updateDoc(adminRef, {
        role: newRole
      });
      setAdmins(admins.map(a => a.id === admin.id ? { ...a, role: newRole } : a));
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update admin role');
    }
  };
  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setInviteSuccess('');

    try {
      await addDoc(collection(db, "adminInvites"), {
        email: inviteEmail,
        role: selectedRole,
        createdAt: new Date(),
        status: 'pending',
        verification: false
      });

      setInviteSuccess(`Invitation recorded for ${inviteEmail} with role: ${selectedRole}`);
      setInviteEmail('');
      setSelectedRole(ROLES.SUB_ADMIN);
    } catch (error) {
      console.error('Error creating invitation:', error);
      setError('Failed to create invitation');
    }
  };

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
      <div className="card mb-4">
        <div className="card-body">
          <h4>Invite New Admin</h4>
          <form onSubmit={handleInviteAdmin} className="row g-3">
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <Form.Select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {Object.values(ROLES).map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Button type="submit" variant="primary" className="w-100">
                Send Invite
              </Button>
            </div>
          </form>
          {inviteSuccess && <Alert variant="success" className="mt-2">{inviteSuccess}</Alert>}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Admins Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Verification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.email}</td>
                <td>
                  <Form.Select
                    value={admin.role || ''}
                    onChange={(e) => handleRoleChange(admin, e.target.value)}
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>{admin.verification ? 'Yes' : 'No'}</td>
                <td>
                  <Button 
                    variant={admin.verification ? "danger" : "success"} 
                    onClick={() => handleVerificationToggle(admin)}
                  >
                    {admin.verification ? 'Unverify' : 'Verify'}
                  </Button>
                </td>
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
