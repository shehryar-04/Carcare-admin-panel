import React, { useState, useEffect } from 'react';  
import { Row, Col, Card, Form, Input, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap';  
  
const ProductForm = () => {  
    const [formData, setFormData] = useState({  
        title: '',  
        description: '',  
        image: '',  
        price: '',  
        category: '',  
        tags: '' // Hardcoded array of tags  
    });  
    const [error, setError] = useState(null); // State for error messages  
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages  
    const [imageFile, setImageFile] = useState(null); // State to hold the image file  
    const [categories, setCategories] = useState([]); // State for categories  
  
    useEffect(() => {  
        // Fetch categories from the API  
        const fetchCategories = async () => {  
            try {  
                const response = await fetch('https://carcarebaked.azurewebsites.net/api/categories');  
                if (!response.ok) {  
                    throw new Error('Failed to fetch categories');  
                }  
                const data = await response.json();  
                setCategories(data); // Assuming the API returns an array of categories  
            } catch (error) {  
                console.error('Error fetching categories:', error);  
                setError(error.message);  
            }  
        };  
  
        fetchCategories();  
    }, []); // Empty dependency array to run once when the component mounts  
  
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
                const response = await fetch('https://carcarebaked.azurewebsites.net/api/uploadImage', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
    
                const result = await response.json(); 
                console.log('Image Upload Result:', result); // Log the result from the server
                const imageUrl = `https://carcarebaked.azurewebsites.net/api/images/${result.image}`; // Adjust based on your API response structure
    
                // Update formData with the image URL
                setFormData((prevData) => ({
                    ...prevData,
                    image: imageUrl,  // Set the image URL to formData
                }));
    
                setImageFile(file.name); // Optionally store the image file name for display
            } catch (error) {
                console.error('Image Upload Error:', error);
                setError(error.message);
            }
        }
    };
    
  
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const data = JSON.stringify(formData); // Convert formData to JSON
    
        // Ensure the image URL is correctly set
        if (!formData.image) {
            setError('Image is required!');
            return;
        }
    
        try {
            setError(null); // Clear previous errors
            setSuccessMessage(''); // Clear previous success messages
    
            // Make the API call
            const response = await fetch('https://carcarebaked.azurewebsites.net/api/createproduct', {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/json' }, // Ensure Content-Type is set to application/json
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Extract error message from the server
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json(); // Get the response data
            console.log('Success:', result); // Log success response
            setSuccessMessage('Product created successfully!'); // Success message
            setFormData({
                title: '',
                description: '',
                image: '',
                price: '',
                category: '',
                tags: ['tag1', 'tag2', 'tag3'],
            }); // Reset form fields after submission
        } catch (error) {
            console.error('Error:', error);
            setError(error.message); // Display the error to the user
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
                            <InputGroup className='input-group-merge'>  
                                <InputGroupText>Title</InputGroupText>  
                                <Input type='text' name='title' id='title' placeholder='Enter product title' value={formData.title} onChange={handleChange} required />  
                            </InputGroup>  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='description'>Description</Label>  
                        <Col sm='9'>  
                            <InputGroup className='input-group-merge'>  
                                <InputGroupText>Description</InputGroupText>  
                                <Input type='textarea' name='description' id='description' placeholder='Enter product description' value={formData.description} onChange={handleChange} required />  
                            </InputGroup>  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='image'>Image Upload</Label>  
                        <Col sm='9'>  
                            <Input type='file' accept='image/*' onChange={handleImageUpload} required />  
                            {imageFile && <p>Uploaded: {imageFile}</p>} {/* Show the uploaded file name */}  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='price'>Price</Label>  
                        <Col sm='9'>  
                            <InputGroup className='input-group-merge'>  
                                <InputGroupText>Price</InputGroupText>  
                                <Input type='number' name='price' id='price' placeholder='Enter product price' value={formData.price} onChange={handleChange} required />  
                            </InputGroup>  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='category'>Category</Label>  
                        <Col sm='9'>  
                            <Input type='select' name='category' id='category' value={formData.category} onChange={handleChange} required>  
                                <option value=''>Select a category</option>  
                                {categories.map((category) => (  
                                    <option key={category.id} value={category.title}>{category.title}</option> // Adjust according to your category structure  
                                ))}  
                            </Input>  
                        </Col>  
                    </Row>  
                    <Row>  
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>  
                            <Button className='me-1' color='primary' type='submit'>Create Product</Button>  
                            <Button outline color='secondary' type='reset' onClick={() => setFormData({ title: '', description: '', image: '', price: '', category: '', tags: ['tag1', 'tag2', 'tag3'] })}>Reset</Button>  
                        </Col>  
                    </Row>  
                </Form>  
            </CardBody>  
        </Card>  
    );  
};  
  
export default ProductForm;  