import React, { useState } from 'react';  
import { Row, Col, Card, Form, Input, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap';  
  
const NotificationForm = () => {  
    const [formData, setFormData] = useState({  
        title: '',  
        body: '',  
    });  
    const [error, setError] = useState(null); // State for error messages  
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages  
  
    const handleChange = (e) => {  
        const { name, value } = e.target;  
        setFormData({ ...formData, [name]: value });  
    };  
  
    const handleSubmit = async (e) => {  
        e.preventDefault(); // Prevent default form submission  
  
        const endpoint = 'https://backend.neurodude.co/api/send-notification-topic';  
        const topicName = 'all-devices'; // Hardcoded topic name  
        const data = JSON.stringify({  
            topic: topicName,  
            title: formData.title,  
            body: formData.body,  
        });  
  
        try {  
            setError(null); // Clear previous errors  
            setSuccessMessage(''); // Clear previous success messages  
  
            // Make the API call  
            const response = await fetch(endpoint, {  
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
            setSuccessMessage('Notification sent successfully!'); // Success message  
            setFormData({ title: '', body: '' }); // Reset form fields after submission  
        } catch (error) {  
            console.error('Error:', error);  
            setError(error.message); // Display the error to the user  
        }  
    };  
  
    return (  
        <Card>  
            <CardHeader>  
                <CardTitle tag='h4'>Send Notification</CardTitle>  
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
                                <Input type='text' name='title' id='title' placeholder='Enter notification title' value={formData.title} onChange={handleChange} required />  
                            </InputGroup>  
                        </Col>  
                    </Row>  
                    <Row className='mb-1'>  
                        <Label sm='3' for='body'>Body</Label>  
                        <Col sm='9'>  
                            <InputGroup className='input-group-merge'>  
                                <InputGroupText>Body</InputGroupText>  
                                <Input type='textarea' name='body' id='body' placeholder='Enter notification body' value={formData.body} onChange={handleChange} required />  
                            </InputGroup>  
                        </Col>  
                    </Row>  
                    <Row>  
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>  
                            <Button className='me-1' color='primary' type='submit'>Send Notification</Button>  
                            <Button outline color='secondary' type='reset' onClick={() => setFormData({ title: '', body: '' })}>Reset</Button>  
                        </Col>  
                    </Row>  
                </Form>  
            </CardBody>  
        </Card>  
    );  
};  
  
export default NotificationForm;  