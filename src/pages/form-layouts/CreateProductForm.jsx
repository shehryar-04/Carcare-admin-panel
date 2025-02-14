import React, { useState, useEffect } from 'react';  
import { Row, Col, Card, Form, Input, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap';  
  
const ProductForm = () => {  
    const [formData, setFormData] = useState({  
        title: '',  
        description: '',  
        image: '',  
        price: '',  
        category: '',  
        quantity: '' 
    });  
    const [error, setError] = useState(null);  
    const [successMessage, setSuccessMessage] = useState('');  
    const [imageFile, setImageFile] = useState(null);  
    const [categories, setCategories] = useState([]);  
  
    useEffect(() => {  
        const fetchCategories = async () => {  
            try {  
                const response = await fetch('https://backend.neurodude.co/api/categories');  
                if (!response.ok) {  
                    throw new Error('Failed to fetch categories');  
                }  
                const data = await response.json();  
                setCategories(data);  
            } catch (error) {  
                console.error('Error fetching categories:', error);  
                setError(error.message);  
            }  
        };  
  
        fetchCategories();  
    }, []);  
  
    const handleChange = (e) => {  
        const { name, value } = e.target;  
        setFormData({ ...formData, [name]: value });  
    };  
  
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                const response = await fetch('https://backend.neurodude.co/api/uploadImage', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
    
                const result = await response.json(); 
                console.log('Image Upload Result:', result);
                const imageUrl = `https://backend.neurodude.co/api/images/${result.image}`;
    
                setFormData((prevData) => ({
                    ...prevData,
                    image: imageUrl,
                }));
    
                setImageFile(file.name);
            } catch (error) {
                console.error('Image Upload Error:', error);
                setError(error.message);
            }
        }
    };
    
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = JSON.stringify(formData);
    
        if (!formData.image) {
            setError('Image is required!');
            return;
        }
    
        try {
            setError(null);
            setSuccessMessage('');
    
            const response = await fetch('https://backend.neurodude.co/api/createproduct', {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json();
            console.log('Success:', result);
            setSuccessMessage('Product created successfully!');
            setFormData({
                title: '',
                description: '',
                image: '',
                price: '',
                category: '',
                quantity: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };
     
  
    return (  
        <Card>  
            <CardHeader>  
                <CardTitle tag='h4'>Create Product</CardTitle>  
            </CardHeader>  
            <CardBody>  
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}  
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}  
                <Form onSubmit={handleSubmit}>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='title'>Title</Label>  
                        <Col sm='9'>  
                            <Input type='text' name='title' id='title' placeholder='Enter product title' value={formData.title} onChange={handleChange} required />  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='description'>Description</Label>  
                        <Col sm='9'>  
                            <Input type='textarea' name='description' id='description' placeholder='Enter product description' value={formData.description} onChange={handleChange} required />  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='image'>Image Upload</Label>  
                        <Col sm='9'>  
                            <Input type='file' accept='image/*' onChange={handleImageUpload} required />  
                            {imageFile && <p>Uploaded: {imageFile}</p>}  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='price'>Price</Label>  
                        <Col sm='9'>  
                            <Input type='number' name='price' id='price' placeholder='Enter product price' value={formData.price} onChange={handleChange} required />  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='category'>Category</Label>  
                        <Col sm='9'>  
                            <Input type='select' name='category' id='category' value={formData.category} onChange={handleChange} required>  
                                <option value=''>Select a category</option>  
                                {categories.map((category) => (  
                                    <option key={category.id} value={category.title}>{category.title}</option>  
                                ))}  
                            </Input>  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='quantity'>Quantity</Label>  
                        <Col sm='9'>  
                            <Input type='number' name='quantity' id='quantity' placeholder='Enter product quantity' value={formData.quantity} onChange={handleChange} required />  
                        </Col>  
                    </Row>  
                    <Row>  
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>  
                            <Button className='me-1' color='primary' type='submit'>Create Product</Button>  
                            <Button outline color='secondary' type='reset' onClick={() => setFormData({ title: '', description: '', image: '', price: '', category: '', quantity: '' })}>Reset</Button>  
                        </Col>  
                    </Row>  
                </Form>  
            </CardBody>  
        </Card>  
    );  
};  
  
export default ProductForm;
