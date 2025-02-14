import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Modal, Button, Form, Alert } from "react-bootstrap";
import { FaBell, FaUser } from "react-icons/fa";
import NotificationComponent from "../../pages/notifications"; // Update path
import { auth } from "../../config/firebase";
import { updatePassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch logged-in user email
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserModal(false);
    navigate("/login"); // Redirect to login page
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
      setShowChangePassword(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar bg="white" className="header">
        <Container fluid>
          <Navbar.Brand style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "poppins", color: "#255B82" }}>
            Car Services Admin
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Item className="me-3">
              {/* Notification Icon */}
              <FaBell onClick={() => setShowNotifications(true)} style={{ cursor: "pointer", height: "20px", width: "20px" }} />

              {/* User Icon */}
              <FaUser onClick={() => setShowUserModal(true)} style={{ cursor: "pointer", marginLeft: "20px", height: "20px", width: "20px" }} />
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      {/* Notifications Modal */}
      <Modal show={showNotifications} onHide={() => setShowNotifications(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NotificationComponent />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotifications(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* User Info Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <p><strong>Email:</strong> {userEmail}</p>

          {/* Show Change Password Button */}
          {!showChangePassword ? (
            <Button variant="outline-primary" className="mt-2 w-100" onClick={() => setShowChangePassword(true)}>
              Change Password
            </Button>
          ) : (
            <>
              <Form.Group className="mt-3">
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" className="mt-2 w-100" onClick={handleUpdatePassword}>
                Update Password
              </Button>
              <Button variant="secondary" className="mt-2 w-100" onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>Close</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
