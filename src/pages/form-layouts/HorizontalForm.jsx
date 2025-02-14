import React, { useState } from 'react';  
import { Card, CardHeader, CardTitle, CardBody, Col, Input, Form, Button, Label, Row } from 'reactstrap';  
  
const HorizontalForm = () => {  
  const initialPackageState = [{ price: '', times: '', description: '' }];  
  const [serviceType, setServiceType] = useState('one-time');  
  const [packages, setPackages] = useState(initialPackageState);  
  const [selectedFile, setSelectedFile] = useState(null);  
  const [uploading, setUploading] = useState(false);  
  const [formValues, setFormValues] = useState({  
    name: '',  
    description: '',  
    image: '',  
    vendorCommission: '',  
    carTypes: { SUV: '', Sedan: '', Hatchback: '' }, // Initialize carTypes  
  });  
  
  const handleFileSelect = (e) => {  
    if (e.target.files && e.target.files[0]) {  
      setSelectedFile(e.target.files[0]);  
    }  
  };  
  
  const uploadImage = async () => {  
    if (!selectedFile) return null;  
    const formData = new FormData();  
    formData.append('image', selectedFile);  
    try {  
      setUploading(true);  
      const response = await fetch('https://backend.neurodude.co/api/uploadImage', {  
        method: 'POST',  
        body: formData,  
      });  
      if (!response.ok) {  
        throw new Error('Image upload failed');  
      }  
      const data = await response.json();  
      return data.image; // Assuming the API returns { url: "image_url" }  
    } catch (error) {  
      console.error('Error uploading image:', error);  
      return null;  
    } finally {  
      setUploading(false);  
    }  
  };  
  
  const handleAddPackage = () => {  
    setPackages([...packages, { price: '', times: '', description: '' }]);  
  };  
  
  const handlePackageChange = (index, field, value) => {  
    const newPackages = [...packages];  
    newPackages[index][field] = value;  
    setPackages(newPackages);  
  };  
  
  const handleServiceTypeChange = (e) => {  
    const selectedType = e.target.value;  
    setServiceType(selectedType);  
    if (selectedType === 'one-time') {  
      setPackages(initialPackageState);  
    }  
    setFormValues({  
      name: '',  
      description: '',  
      image: '',  
      vendorCommission: '',  
      carTypes: { SUV: '', Sedan: '', Hatchback: '' }, // Reset carTypes  
    });  
  };  
  
  const handleReset = () => {  
    setServiceType('one-time');  
    setPackages(initialPackageState);  
    setFormValues({  
      name: '',  
      description: '',  
      image: '',  
      vendorCommission: '',  
      carTypes: { SUV: '', Sedan: '', Hatchback: '' }, // Reset carTypes  
    });  
    setSelectedFile(null);  
  };  
  
  const handleCarTypeChange = (carType, value) => {  
    setFormValues((prev) => ({  
      ...prev,  
      carTypes: {  
        ...prev.carTypes,  
        [carType]: value,  
      },  
    }));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
  
    // First upload the image if one is selected  
    let imageUrl = formValues.image;  
    if (selectedFile) {  
      imageUrl = await uploadImage();  
      if (!imageUrl) {  
        console.error('Failed to upload image');  
        return;  
      }  
    }  
  
    // Prepare the data based on service type  
    const requestData = {  
      name: formValues.name,  
      description: formValues.description,  
      image: `https://backend.neurodude.co/api/image/${imageUrl}`,  
      vendorCommission: parseFloat(formValues.vendorCommission) || 0,  
      packages: serviceType === 'one-time'  
        ? [{  
            price: parseFloat(packages[0].price) || 0,  
            times: parseInt(packages[0].times) || 0,  
            description: packages[0].description || '',  
          }]  
        : packages.map(pkg => ({  
            price: parseFloat(pkg.price) || 0,  
            times: parseInt(pkg.times) || 0,  
            description: pkg.description || '',  
          })),  
      carTypes: formValues.carTypes, // Include carTypes  
    };  
  
    console.log(requestData);  
    try {  
      const response = await fetch('https://backend.neurodude.co/api/createService', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify(requestData),  
      });  
      if (!response.ok) {  
        throw new Error('Network response was not ok');  
      }  
      const data = await response.json();  
      console.log('Service created successfully:', data);  
      handleReset();  
    } catch (error) {  
      console.error('Error creating service:', error);  
    }  
  };  
  
  return (  
    <Card>  
      <CardHeader>  
        <CardTitle tag="h4">Service Form</CardTitle>  
      </CardHeader>  
      <CardBody>  
        <Form onSubmit={handleSubmit}>  
          <Row className="mb-1">  
            <Label sm="3" for="name">Service Name</Label>  
            <Col sm="9">  
              <Input  
                type="text"  
                name="name"  
                id="name"  
                placeholder="Service Name"  
                value={formValues.name}  
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}  
              />  
            </Col>  
          </Row>  
          <Row className="mb-1">  
            <Label sm="3" for="description">Description</Label>  
            <Col sm="9">  
              <Input  
                type="textarea"  
                name="description"  
                id="description"  
                placeholder="Description"  
                value={formValues.description}  
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}  
              />  
            </Col>  
          </Row>  
          <Row className="mb-1">  
            <Label sm="3" for="image">Image</Label>  
            <Col sm="9">  
              <Input  
                type="file"  
                name="image"  
                id="image"  
                accept="image/*"  
                onChange={handleFileSelect}  
              />  
              {selectedFile && <div className="mt-1">Selected: {selectedFile.name}</div>}  
            </Col>  
          </Row>  
          <Row className="mb-1">  
            <Label sm="3" for="imageUrl">Image URL (Optional)</Label>  
            <Col sm="9">  
              <Input  
                type="text"  
                name="imageUrl"  
                id="imageUrl"  
                placeholder="Or enter image URL directly"  
                value={formValues.image}  
                onChange={(e) => setFormValues({ ...formValues, image: e.target.value })}  
              />  
            </Col>  
          </Row>  
          <Row className="mb-1">  
            <Label sm="3" for="vendorCommission">Vendor Commission</Label>  
            <Col sm="9">  
              <Input  
                type="number"  
                name="vendorCommission"  
                id="vendorCommission"  
                placeholder="Vendor Commission"  
                value={formValues.vendorCommission}  
                onChange={(e) => setFormValues({ ...formValues, vendorCommission: e.target.value })}  
              />  
            </Col>  
          </Row>  
          <Row className="mb-1">  
            <Label sm="3">Service Type</Label>  
            <Col sm="9">  
              <Input  
                type="select"  
                name="serviceType"  
                id="serviceType"  
                value={serviceType}  
                onChange={handleServiceTypeChange}  
              >  
                <option value="one-time">One-Time</option>  
                <option value="package">Package</option>  
              </Input>  
            </Col>  
          </Row>  
  
          {/* Package fields remain the same */}  
          {serviceType === 'one-time' && (  
            <>  
              <Row className="mb-1">  
                <Label sm="3">Package Details</Label>  
                <Col sm="9">  
                  <Button color="primary" onClick={handleAddPackage}>  
                    Add Package  
                  </Button>  
                </Col>  
              </Row>  
              {packages.map((pkg, index) => (  
                <Row className="mb-1" key={index}>  
                  <Label sm="3" for={`price-${index}`}>  
                    Price  
                  </Label>  
                  <Col sm="4">  
                    <Input  
                      type="number"  
                      name={`price-${index}`}  
                      id={`price-${index}`}  
                      placeholder="Price"  
                      value={pkg.price}  
                      onChange={(e) => handlePackageChange(index, 'price', e.target.value)}  
                    />  
                  </Col>  
                  <Label sm="2" for={`times-${index}`}>  
                    Times  
                  </Label>  
                  <Col sm="3">  
                    <Input  
                      type="number"  
                      name={`times-${index}`}  
                      id={`times-${index}`}  
                      placeholder="Times"  
                      value={pkg.times}  
                      onChange={(e) => handlePackageChange(index, 'times', e.target.value)}  
                    />  
                  </Col>  
                  <Label sm="3" for={`description-${index}`}>  
                    Description  
                  </Label>  
                  <Col sm="9">  
                    <Input  
                      type="textarea"  
                      name={`description-${index}`}  
                      id={`description-${index}`}  
                      placeholder="Description"  
                      value={pkg.description}  
                      onChange={(e) => handlePackageChange(index, 'description', e.target.value)}  
                    />  
                  </Col>  
                </Row>  
              ))}  
            </>  
          )}  
          {serviceType === 'package' && (  
            <>  
              <Row className="mb-1">  
                <Label sm="3">Package Details</Label>  
                <Col sm="9">  
                  <Button color="primary" onClick={handleAddPackage}>  
                    Add Package  
                  </Button>  
                </Col>  
              </Row>  
              {packages.map((pkg, index) => (  
                <Row className="mb-1" key={index}>  
                  <Label sm="3" for={`price-${index}`}>  
                    Price  
                  </Label>  
                  <Col sm="4">  
                    <Input  
                      type="number"  
                      name={`price-${index}`}  
                      id={`price-${index}`}  
                      placeholder="Price"  
                      value={pkg.price}  
                      onChange={(e) => handlePackageChange(index, 'price', e.target.value)}  
                    />  
                  </Col>  
                  <Label sm="2" for={`times-${index}`}>  
                    Times  
                  </Label>  
                  <Col sm="3">  
                    <Input  
                      type="number"  
                      name={`times-${index}`}  
                      id={`times-${index}`}  
                      placeholder="Times"  
                      value={pkg.times}  
                      onChange={(e) => handlePackageChange(index, 'times', e.target.value)}  
                    />  
                  </Col>  
                  <Label sm="3" for={`description-${index}`}>  
                    Description  
                  </Label>  
                  <Col sm="9">  
                    <Input  
                      type="textarea"  
                      name={`description-${index}`}  
                      id={`description-${index}`}  
                      placeholder="Description"  
                      value={pkg.description}  
                      onChange={(e) => handlePackageChange(index, 'description', e.target.value)}  
                    />  
                  </Col>  
                </Row>  
              ))}  
            </>  
          )}  
  
          {/* Car Types Section */}  
          <Row className="mb-1">  
            <Label sm="3">Car Types</Label>  
            <Col sm="9">  
              <Row>  
                <Col sm="4">  
                  <Label for="SUV">SUV</Label>  
                  <Input  
                    type="number"  
                    id="SUV"  
                    value={formValues.carTypes.SUV}  
                    onChange={(e) => handleCarTypeChange('SUV', e.target.value)}  
                    placeholder="Price for SUV"  
                  />  
                </Col>  
                <Col sm="4">  
                  <Label for="Sedan">Sedan</Label>  
                  <Input  
                    type="number"  
                    id="Sedan"  
                    value={formValues.carTypes.Sedan}  
                    onChange={(e) => handleCarTypeChange('Sedan', e.target.value)}  
                    placeholder="Price for Sedan"  
                  />  
                </Col>  
                <Col sm="4">  
                  <Label for="Hatchback">Hatchback</Label>  
                  <Input  
                    type="number"  
                    id="Hatchback"  
                    value={formValues.carTypes.Hatchback}  
                    onChange={(e) => handleCarTypeChange('Hatchback', e.target.value)}  
                    placeholder="Price for Hatchback"  
                  />  
                </Col>  
              </Row>  
            </Col>  
          </Row>  
  
          <Row>  
            <Col className="d-flex" md={{ size: 9, offset: 3 }}>  
              <Button  
                className="me-1"  
                color="primary"  
                type="submit"  
                disabled={uploading}  
              >  
                {uploading ? 'Uploading...' : 'Submit'}  
              </Button>  
              <Button outline color="secondary" type="button" onClick={handleReset}>  
                Reset  
              </Button>  
            </Col>  
          </Row>  
        </Form>  
      </CardBody>  
    </Card>  
  );  
};  
  
export default HorizontalForm;  