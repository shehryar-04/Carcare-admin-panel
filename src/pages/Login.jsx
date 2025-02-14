import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "react-feather";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../config/firebase"; // Import Firestore and Auth
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { loginSuccess } from "../store/slices/authSlice";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Email/Password Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignup) {
      // Handle Signup with email and password
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Send a verification email to the user
        await sendEmailVerification(user);

        // Check if this is the first admin in the collection
        const adminsRef = collection(db, "admins");
        const querySnapshot = await getDocs(adminsRef);
        // For email/password signup, you may want to set the owner if this is the first admin.
        const role = querySnapshot.empty ? "owner" : "sub-admin";
        const verification = querySnapshot.empty ? true : false;

        // Save user data in Firestore with role and verification field
        await setDoc(doc(db, "admins", user.uid), {
          email: user.email,
          role: role,
          verification: verification,
          createdAt: new Date(),
        });

        dispatch(loginSuccess({ email: user.email }));

        // Inform the user to verify their email
        alert(
          "A verification email has been sent to your email address. Please verify your email before logging in."
        );
        navigate("/dashboard");
      } catch (err) {
        setError(getErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Login with email and password
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch(loginSuccess({ email: userCredential.user.email }));
        navigate("/dashboard");
      } catch (err) {
        setError(getErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    }
  };

  // Google Authentication Handler
  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // If in signup mode, add the user data to the admins collection
      if (isSignup) {
        await setDoc(doc(db, "admins", user.uid), {
          email: user.email,
          role: "sub-admin",
          verification: false,
          createdAt: new Date(),
        });
      }
      dispatch(loginSuccess({ email: user.email }));
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err.code) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered";
      case "auth/invalid-email":
        return "Please enter a valid email address";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password";
      case "auth/weak-password":
        return "Password must be at least 6 characters long";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  return (
    <Container fluid>
      <Row className="min-vh-100 align-items-center justify-content-center bg-light" style={{width: '100%' }}>
        <Col xs={18} sm={30} md={50} lg={100}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">
                {isSignup ? "Sign Up" : "Admin Login"}
              </h2>
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
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <InputGroup.Text
                      style={{
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {isSignup && (
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <InputGroup.Text
                        style={{
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                )}

                <Button type="submit" className="w-100" disabled={loading}>
                  {loading
                    ? isSignup
                      ? "Signing up..."
                      : "Logging in..."
                    : isSignup
                    ? "Sign Up"
                    : "Login"}
                </Button>
              </Form>

              {/* Google Auth Button */}
              <div className="text-center mt-3">
                <Button
                  variant="danger"
                  className="w-100 mb-3"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  {isSignup ? "Sign Up with Google" : "Sign In with Google"}
                </Button>
              </div>

              <div className="text-center mt-3">
                {isSignup ? (
                  <p>
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignup(false);
                        setError("");
                      }}
                      className="p-0"
                    >
                      Login
                    </Button>
                  </p>
                ) : (
                  <p>
                    Don’t have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsSignup(true);
                        setError("");
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
