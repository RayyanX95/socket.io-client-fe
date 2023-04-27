import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../user-context";

function RoomForm({ show, handleClose }) {
  const { socket, setRoomId } = useContext(UserContext);

  const [inputValue, handleInput] = useState("");

  const handleCreateRoom = () => {
    socket && socket.emit("joinRoom", inputValue);

    setRoomId(inputValue);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create or Join Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Create / Join Room Id"
              autoFocus
              onChange={(e) => handleInput(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateRoom}>
          Create Room
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RoomForm;
