import React, { useState, useEffect } from 'react';
import { Table, Alert, Image, Button } from 'react-bootstrap'; // React-Bootstrap components
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'; // Firebase imports

const Products = () => {
  const [products, setProducts] = useState([]); // State to hold product data
  const [error, setError] = useState(''); // State to hold error messages

  // Function to fetch products from Firebase Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products")); // Assuming 'products' is your collection
      const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productData); // Set the fetched products to state
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  // Function to update product tags in Firestore
  const updatetags = async (productId, action) => {
    try {
      const productDoc = doc(db, "products", productId);
      const product = products.find(p => p.id === productId);

      if (action === 'increase') {
        product.tags += 1;
      } else if (action === 'decrease' && product.tags > 0) {
        product.tags -= 1;
      }

      await updateDoc(productDoc, { tags: product.tags });
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, tags: product.tags } : p
        )
      );
    } catch (error) {
      console.error('Error updating tags:', error);
      setError('Failed to update tags');
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>

      {error && <Alert variant="danger">{error}</Alert>} {/* Display error if any */}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Quantity</th> {/* Removed Tags column */}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={product.image}
                    alt={product.title}
                    thumbnail
                    style={{ maxWidth: '100px' }}
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.description}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-danger"
                      onClick={() => updatetags(product.id, 'decrease')}
                    >
                      -
                    </Button>
                    <span className="mx-2">{product.tags}</span>
                    <Button
                      variant="outline-success"
                      onClick={() => updatetags(product.id, 'increase')}
                    >
                      +
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center"> {/* Adjusted colSpan */}
                Loading products...
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Products;
