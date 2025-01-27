import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { loginSuccess } from '../store/slices/authSlice';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Signup
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignup) {
      // Handle Signup
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        dispatch(loginSuccess({ email: userCredential.user.email }));
        navigate('/dashboard');
      } catch (err) {
        const errorMessage = getErrorMessage(err.code);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        dispatch(loginSuccess({ email: userCredential.user.email }));
        navigate('/dashboard');
      } catch (err) {
        const errorMessage = getErrorMessage(err.code);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  return (
    <Container fluid>
      <Row className="min-vh-100 align-items-center justify-content-center bg-light">
        <Col xs={12} sm={10} md={8} lg={60}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">{isSignup ? 'Sign Up' : 'Admin Login'}</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email Address"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </Form.Group>
                {isSignup && (
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      aria-label="Confirm Password"
                    />
                  </Form.Group>
                )}
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : isSignup ? 'Sign Up' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                {isSignup ? (
                  <p>
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignup(false);
                        setError('');
                      }}
                      className="p-0"
                    >
                      Login
                    </Button>
                  </p>
                ) : (
                  <p>
                    Don’t have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignup(true);
                        setError('');
                      }}
                      className="p-0"
                    >
                      Sign Up
                    </Button>
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;
