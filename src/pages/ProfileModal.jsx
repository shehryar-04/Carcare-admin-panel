import { Modal } from "react-bootstrap";
import { signOut } from "firebase/auth";

const [showModal, setShowModal] = useState(false);
const [userEmail, setUserEmail] = useState("");


try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  dispatch(loginSuccess({ email: user.email }));
  setUserEmail(user.email);
  setShowModal(true); // Show the modal after login
} catch (err) {
  setError(getErrorMessage(err.code));
}

const handleLogout = async () => {
  await signOut(auth);
  setShowModal(false);
  navigate("/"); // Redirect to home or login page
};

<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>User Info</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p><strong>Email:</strong> {userEmail}</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  </Modal.Footer>
</Modal>