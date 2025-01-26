import React, { useState } from 'react';  
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';  
import { FaBell } from 'react-icons/fa';  
import NotificationComponent from '../../pages/notifications'; // Update this to the correct path  
  
const Header = () => {  
  const [show, setShow] = useState(false);  
  
  const handleClose = () => setShow(false);  
  const handleShow = () => setShow(true);  
  
  return (  
    <>  
      <Navbar bg="white" className="header">  
        <Container fluid>  
          <Navbar.Brand>Car Services Admin</Navbar.Brand>  
          <Nav className="ms-auto">  
            <Nav.Item className="me-3">  
              <FaBell onClick={handleShow} style={{ cursor: 'pointer' }} />  
            </Nav.Item>  
          </Nav>  
        </Container>  
      </Navbar>  
  
      <Modal show={show} onHide={handleClose} size="lg">  
        <Modal.Header closeButton>  
          <Modal.Title>Notifications</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <NotificationComponent />  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="secondary" onClick={handleClose}>  
            Close  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </>  
  );  
};  
  
export default Header;  