import React, { useState } from 'react';      
import { Row, Col, Card, Form, Input, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap';      
import { Map, User } from 'react-feather'; // Import User icon  
  
const HorizontalFormIcons = () => {            
    const [formType, setFormType] = useState('Create-area');            
    const [formData, setFormData] = useState({                  
        name: '',                  
        image: null,                  
        bannerTitle: '',                  
        title: '',                  
        author: '',                  
        content: '',            
    });            
    const [error, setError] = useState(null); // State for error messages          
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages          
  
    const handleChange = (e) => {                  
        const { name, value, type, files } = e.target;                  
        setFormData({                        
            ...formData,                        
            [name]: type === 'file' ? files[0] : value, // Handle file input separately                  
        });            
    };            
  
    const handleSubmit = async (e) => {                  
        e.preventDefault(); // Prevent default form submission                    
  
        let endpoint = '';                  
        let data = null;                    
  
        try {                          
            setError(null); // Clear previous errors                          
            setSuccessMessage(''); // Clear previous success messages                              
  
            switch (formType) {                                  
                case 'Create-area':                                          
                    endpoint = 'https://backend.neurodude.co/api/areas';                                          
                    data = JSON.stringify({ name: formData.name });                                          
                    break;                                  
                case 'banners':                      
                    // Step 1: Upload the image                      
                    const formDataBanner = new FormData();                      
                    formDataBanner.append('image', formData.image); // Append the image file                                      
  
                    const uploadResponse = await fetch('https://backend.neurodude.co/api/uploadImage', {                          
                        method: 'POST',                          
                        body: formDataBanner,                      
                    });                                      
  
                    if (!uploadResponse.ok) {                          
                        throw new Error(`Image upload failed! Status: ${uploadResponse.status}`);                      
                    }                      
  
                    const uploadResult = await uploadResponse.json();                      
                    const imagePath = uploadResult.image; // Get the 'image' field from the response                                      
  
                    // Step 2: Prepare the banner data                      
                    endpoint = 'https://backend.neurodude.co/api/createBanner';                      
                    data = JSON.stringify({                          
                        image: `https://backend.neurodude.co/api/image/${imagePath}`,                      
                    });                      
                    break;                   
                case 'blogs':                                          
                    endpoint = 'https://backend.neurodude.co/api/createBlog';                           
                    data = JSON.stringify({                                                  
                        title: formData.title,                                                  
                        author: formData.author,                                                  
                        content: formData.content,                                                                  
                    });                                          
                    break;                                  
                case 'createCategory': // New case for category creation  
                    // Step 1: Upload the image  
                    const formDataCategory = new FormData();  
                    formDataCategory.append('image', formData.image); // Append the image file  
  
                    const uploadResponseCategory = await fetch('https://backend.neurodude.co/api/uploadImage', {  
                        method: 'POST',  
                        body: formDataCategory,  
                    });  
  
                    if (!uploadResponseCategory.ok) {  
                        throw new Error(`Image upload failed! Status: ${uploadResponseCategory.status}`);  
                    }  
  
                    const uploadResultCategory = await uploadResponseCategory.json();  
                    const imagePathCategory = uploadResultCategory.image; // Get the 'image' field from the response  
  
                    // Step 2: Prepare the category data  
                    endpoint = 'https://backend.neurodude.co/api/createCategory';  
                    data = JSON.stringify({  
                        title: formData.name, // Use the name field for the title  
                        image: `https://backend.neurodude.co/api/image/${imagePathCategory}`,  
                    });  
                    break;  
  
                default:                                          
                    throw new Error('Invalid form type selected!');                          
            }                              
  
            // Make the second API call for creating the area, banner, blog, or category  
            const response = await fetch(endpoint, {                  
                method: 'POST',                  
                body: data,                  
                headers: { 'Content-Type': 'application/json' }, // Ensure Content-Type is set to application/json              
            });                          
  
            if (!response.ok) {                  
                const errorText = await response.text(); // Extract error message from the server                  
                throw new Error(`Error: ${response.status} - ${errorText}`);              
            }                                
  
            const result = await response.json();                          
            setSuccessMessage('Form submitted successfully!'); // Success message                          
            setFormData({ // Reset form fields after submission                                  
                name: '',                                  
                image: null,                                  
                bannerTitle: '',                                  
                title: '',                                  
                author: '',                                  
                content: '',                          
            });                  
        } catch (error) {                          
            console.error('Error:', error);                          
            setError(error.message); // Display the error to the user                  
        }          
    };            
  
    const renderFormFields = () => {                  
        switch (formType) {                        
            case 'Create-area':                              
                return (                                    
                    <Row className='mb-1'>                                          
                        <Label sm='3' for='nameIcons'>                                               
                            Area Name                                          
                        </Label>                                          
                        <Col sm='9'>                                               
                            <InputGroup className='input-group-merge'>                                                      
                                <InputGroupText>                                                            
                                    <Map size={15} color='#255B82' />                                                      
                                </InputGroupText>                                                      
                                <Input type='text' name='name' id='nameIcons' placeholder='Area Name' value={formData.name} onChange={handleChange} />                                                      
                            </InputGroup>                                          
                        </Col>                                    
                    </Row>                              
                );                  
            case 'banners':                              
                return (                                    
                    <>                                          
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='imageIcons'>                                                     
                                Image                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <InputGroup className='input-group-merge'>                                                            
                                    <Input type='file' name='image' id='imageIcons' onChange={handleChange} />                                                     
                                </InputGroup>                                               
                            </Col>                                          
                        </Row>                                    
                    </>                              
                );                  
            case 'blogs':                              
                return (                                    
                    <>                                          
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='titleIcons'>                                                     
                                Title                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <InputGroup className='input-group-merge'>                                                            
                                    <InputGroupText>                                                                 
                                        <User size={15} />                                                            
                                    </InputGroupText>                                                            
                                    <Input type='text' name='title' id='titleIcons' placeholder='Title' value={formData.title} onChange={handleChange} />                                                     
                                </InputGroup>                                               
                            </Col>                                          
                        </Row>                                          
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='authorIcons'>                                                     
                                Author                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <InputGroup className='input-group-merge'>                                                            
                                    <InputGroupText>                                                                 
                                        <User size={15} />                                                            
                                    </InputGroupText>                                                            
                                    <Input type='text' name='author' id='authorIcons' placeholder='Author Name' value={formData.author} onChange={handleChange} />                                                     
                                </InputGroup>                                               
                            </Col>                                          
                        </Row>                                          
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='contentIcons'>                                                     
                                Content                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <Input type='textarea' name='content' id='contentIcons' placeholder='Blog Content' value={formData.content} onChange={handleChange} />                                               
                            </Col>                                          
                        </Row>                                    
                    </>                              
                );                  
            case 'createCategory': // New case for category creation  
                return (  
                    <>    
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='titleIcons'>                                                     
                                Title                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <InputGroup className='input-group-merge'>                                                            
                                    <Input type='text' name='name' id='titleIcons' placeholder='Category Title' value={formData.name} onChange={handleChange} />                                                     
                                </InputGroup>                                               
                            </Col>                                          
                        </Row>  
                        <Row className='mb-1'>                                               
                            <Label sm='3' for='imageIcons'>                                                     
                                Image                                               
                            </Label>                                               
                            <Col sm='9'>                                                     
                                <InputGroup className='input-group-merge'>                                                            
                                    <Input type='file' name='image' id='imageIcons' onChange={handleChange} />                                                     
                                </InputGroup>                                               
                            </Col>                                          
                        </Row>                                    
                    </>  
                );                  
            default:                              
                return null;                  
        }            
    };            
  
    return (                  
        <Card>                        
            <CardHeader>                              
                <CardTitle tag='h4'>Create Area, Banner, Blog, or Category</CardTitle>                        
            </CardHeader>                        
            <CardBody>                              
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}                              
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}                              
                <Form onSubmit={handleSubmit}>                                    
                    <Row className='mb-1'>                                          
                        <Label sm='3' for='formType'>                                               
                            Select Form Type                                          
                        </Label>                                          
                        <Col sm='9'>                                               
                            <Input type='select' name='formType' id='formType' onChange={e => setFormType(e.target.value)}>                                                      
                                <option value='Create-area'>Create Area</option>                                                      
                                <option value='banners'>Banners</option>                                                      
                                <option value='blogs'>Blogs</option>  
                                <option value='createCategory'>Create Category</option> {/* New option for category creation */}                                                
                            </Input>                                          
                        </Col>                                    
                    </Row>                                    
                    {renderFormFields()}                                    
                    <Row>                                          
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>                                                
                            <Button className='me-1' color='primary' type='submit'>                                                      
                                Submit                                                
                            </Button>                                                
                            <Button outline color='secondary' type='reset' onClick={() => setFormData({                                                      
                                name: '',                                                      
                                image: null,                                                      
                                bannerTitle: '',                                                      
                                title: '',                                                      
                                author: '',                                                      
                                content: '',                                                
                            })}>                                                     
                                Reset                                                
                            </Button>                                          
                        </Col>                                    
                    </Row>                              
                </Form>                        
            </CardBody>                  
        </Card>            
    );      
};        
  
export default HorizontalFormIcons;   