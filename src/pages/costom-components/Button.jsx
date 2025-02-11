// OpenCalendarModalButton.js  
import React, { useState } from 'react';  
import { Button, Modal } from 'react-bootstrap';  
import ServiceRequestCalendar from '../Calender'; // Adjust the path as necessary  
  
const OpenCalendarModalButton = ({ requestId }) => {  
  const [showModal, setShowModal] = useState(false);  
  
  const handleOpenModal = () => setShowModal(true);  
  const handleCloseModal = () => setShowModal(false);  
  
  return (  
    <>  
      <Button variant="primary" onClick={handleOpenModal}>  
        Open Calendar  
      </Button>  
  
      <Modal  
        show={showModal}  
        onHide={handleCloseModal}  
        size="lg"  
      >  
        <Modal.Header closeButton>  
          <Modal.Title>Service Request Calendar</Modal.Title>  
        </Modal.Header>  
        <Modal.Body>  
          <ServiceRequestCalendar requestId={requestId} />
          {console.log(requestId)}  
        </Modal.Body>  
        <Modal.Footer>  
          <Button variant="primary" onClick={handleCloseModal}>  
            Close  
          </Button>  
        </Modal.Footer>  
      </Modal>  
    </>  
  );  
};  
  
export default OpenCalendarModalButton;  