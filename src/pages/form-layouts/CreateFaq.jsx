import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Label, Button, CardBody, CardTitle, CardHeader, InputGroup, InputGroupText } from 'reactstrap';
import { db } from '../../config/firebase'; // Import Firebase Firestore instance
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const FAQForm = () => {
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [faqs, setFaqs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchFAQs();
    }, []);

    // Fetch FAQs from Firestore
    const fetchFAQs = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'faqs'));
            const faqList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFaqs(faqList);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add or Edit FAQ in Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setSuccessMessage('');
            if (editingId) {
                // Update existing FAQ
                const faqRef = doc(db, 'faqs', editingId);
                await updateDoc(faqRef, formData);
                setSuccessMessage('FAQ updated successfully!');
            } else {
                // Create new FAQ
                await addDoc(collection(db, 'faqs'), formData);
                setSuccessMessage('FAQ created successfully!');
            }
            setFormData({ question: '', answer: '' });
            setEditingId(null);
            fetchFAQs();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            setError(error.message);
        }
    };

    // Populate form for editing
    const handleEdit = (faq) => {
        setFormData({ question: faq.question, answer: faq.answer });
        setEditingId(faq.id);
    };

    // Delete FAQ from Firestore
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'faqs', id));
            setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
            setSuccessMessage('FAQ deleted successfully!');
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setError(error.message);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>{editingId ? 'Edit FAQ' : 'Create FAQ'}</CardTitle>
            </CardHeader>
            <CardBody>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <Form onSubmit={handleSubmit}>
                    <Row className='mb-1'>
                        <Label sm='3' for='question'>Question</Label>
                        <Col sm='9'>
                            <InputGroup className='input-group-merge'>
                                <InputGroupText>Q</InputGroupText>
                                <Input type='text' name='question' id='question' placeholder='Enter FAQ question' value={formData.question} onChange={handleChange} required />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className='mb-1'>
                        <Label sm='3' for='answer'>Answer</Label>
                        <Col sm='9'>
                            <InputGroup className='input-group-merge'>
                                <InputGroupText>A</InputGroupText>
                                <Input type='textarea' name='answer' id='answer' placeholder='Enter FAQ answer' value={formData.answer} onChange={handleChange} required />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>
                            <Button className='me-1' color='primary' type='submit'>{editingId ? 'Update FAQ' : 'Create FAQ'}</Button>
                            <Button outline color='secondary' type='reset' onClick={() => { setFormData({ question: '', answer: '' }); setEditingId(null); }}>Reset</Button>
                        </Col>
                    </Row>
                </Form>
                <hr />
                <h5>Existing FAQs</h5>
                {faqs.map((faq) => (
                    <Card key={faq.id} className='mb-2'>
                        <CardBody>
                            <h6>{faq.question}</h6>
                            <p>{faq.answer}</p>
                            <Button color='warning' className='me-1' onClick={() => handleEdit(faq)}>Edit</Button>
                            <Button color='danger' onClick={() => handleDelete(faq.id)}>Delete</Button>
                        </CardBody>
                    </Card>
                ))}
            </CardBody>
        </Card>
    );
};

export default FAQForm;
