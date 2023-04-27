import React, { useContext, useState } from "react";
import styled from "styled-components";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { UserContext } from "../user-context";

const remoteUrl = "https://chat-runtime-with-video.onrender.com";
const localUrl = "http://localhost:5000";

const LoginForm = ({ show, handleClose }) => {
  const { isSignedIn, setIsSignedIn } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, toggleIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    toggleIsLoading(true);
    fetch(remoteUrl + "/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        toggleIsLoading(false);

        if (data.error) {
          setErrMessage(data.error.message);
        }

        if (data.token) {
          setIsSignedIn(true);
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("username", JSON.stringify(username));
          setErrMessage("");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        toggleIsLoading(false);
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Sign in</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {errMessage && <TextRed>{errMessage}</TextRed>}
          {!isSignedIn ? (
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Username"
                autoComplete="false"
                value={username}
                onChange={handleUsernameChange}
              />
              <Input
                type="password"
                placeholder="Password"
                autoComplete="false"
                value={password}
                onChange={handlePasswordChange}
              />
              <Button type="submit">
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mx-1"
                  />
                ) : (
                  "Log in"
                )}
              </Button>
            </Form>
          ) : (
            <SuccessMessage>
              You have signed in successfully ✌️🎉
            </SuccessMessage>
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 0.4rem;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }
`;

const Button = styled.button`
  width: 200px;
  height: 40px;
  background-color: #5eb51a;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #53a316;
  }
`;

const SuccessMessage = styled.h5`
  color: #53a316;
`;

const TextRed = styled.p`
  color: #d22;
`;
