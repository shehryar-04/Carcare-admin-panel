import React, { useState } from 'react';  
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';  
import { useNavigate } from 'react-router-dom';  
import { useDispatch } from 'react-redux';  
import { createUserWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../config/firebase';  
import { loginSuccess } from '../store/slices/authSlice';  
  
const Signup = () => {  
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate();  
    const dispatch = useDispatch();  
  
    const handleSubmit = async (e) => {  
        e.preventDefault();  
        try {  
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);  
            dispatch(loginSuccess({ email: userCredential.user.email }));  
            navigate('/dashboard');  
        } catch (err) {  
            setError(err.message);  
        }  
    };  
  
    return (  
        <Container fluid>  
            <Row className="min-vh-100 align-items-center justify-content-center bg-light">  
                <Col xs={12} sm={8} md={6} lg={4}>  
                    <Card className="shadow">  
                        <Card.Body className="p-4">  
                            <h2 className="text-center mb-4">Sign Up</h2>  
                            {error && <Alert variant="danger">{error}</Alert>}  
                            <Form onSubmit={handleSubmit}>  
                                <Form.Group className="mb-3">  
                                    <Form.Label>Email</Form.Label>  
                                    <Form.Control  
                                        type="email"  
                                        value={email}  
                                        onChange={(e) => setEmail(e.target.value)}  
                                        required  
                                    />  
                                </Form.Group>  
                                <Form.Group className="mb-3">  
                                    <Form.Label>Password</Form.Label>  
                                    <Form.Control  
                                        type="password"  
                                        value={password}  
                                        onChange={(e) => setPassword(e.target.value)}  
                                        required  
                                    />  
                                </Form.Group>  
                                <Button type="submit" className="w-100">  
                                    Sign Up  
                                </Button>  
                            </Form>  
                        </Card.Body>  
                    </Card>  
                </Col>  
            </Row>  
        </Container>  
    );  
};  
  
export default Signup;  