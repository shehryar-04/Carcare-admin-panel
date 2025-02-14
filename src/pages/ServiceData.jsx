import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Form, Modal, Image } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedService, setUpdatedService] = useState({});

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const serviceData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(serviceData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    setEditingService(service);
    setUpdatedService({ ...service });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const serviceRef = doc(db, "services", editingService.id);
      await updateDoc(serviceRef, updatedService);
      setServices(services.map(s => s.id === editingService.id ? { ...updatedService } : s));
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Failed to update service');
    }
    setShowModal(false);
    setEditingService(null);
  };

  const handleDelete = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "services", serviceId));
      setServices(services.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Services Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Packages</th>
            <th>Car Types</th>
            <th>Vendor Commission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service.id}>
                <td><Image src={service.image} alt={service.name} thumbnail style={{ maxWidth: '100px' }} /></td>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>
                  {service.packages.map((pkg, index) => (
                    <div key={index}><strong>{pkg.name || "Single Time"}</strong>: {pkg.times} times - ${pkg.price}</div>
                  ))}
                </td>
                <td>
                  <ul>
                    {Object.entries(service.carTypes).map(([type, price]) => (
                      <li key={type}><strong>{type}</strong>: ${price}</li>
                    ))}
                  </ul>
                </td>
                <td>{service.vendorCommission}%</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClick(service)}>Edit</Button>
                  {' '}
                  <Button variant="danger" onClick={() => handleDelete(service.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Loading services...</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={updatedService.name || ''} onChange={(e) => setUpdatedService({ ...updatedService, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={updatedService.description || ''} onChange={(e) => setUpdatedService({ ...updatedService, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Services;
