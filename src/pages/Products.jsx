import React, { useState, useEffect } from 'react';
import { Table, Alert, Image, Button, Form, Modal } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');

  // Fetch products from Firebase Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedPrice(product.price);
    setUpdatedQuantity(product.quantity);
    setShowWarning(true);
  };

  // Handle update confirmation
  const handleUpdate = async () => {
    try {
      const productRef = doc(db, "products", editingProduct.id);
      await updateDoc(productRef, {
        price: parseFloat(updatedPrice),
        quantity: parseInt(updatedQuantity)
      });
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, price: updatedPrice, quantity: updatedQuantity } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }
    setShowWarning(false);
    setEditingProduct(null);
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image src={product.image} alt={product.title} thumbnail style={{ maxWidth: '100px' }} />
                </td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClick(product)}>Edit</Button>
                  {' '}
                  <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Loading products...</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Warning Modal */}
      <Modal show={showWarning} onHide={() => setShowWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update this product?</p>
          <Form>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={updatedPrice} onChange={(e) => setUpdatedPrice(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={updatedQuantity} onChange={(e) => setUpdatedQuantity(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWarning(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
