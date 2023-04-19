import React, { useEffect, useState } from "react";
import ChatRoom from "./components/chat";
import LoginForm from "./components/login-form";
import styled from "styled-components";
import { UserContext } from "./user-context";

function App() {
  const [show, setShowModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      setIsSignedIn(true);
    }
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const logout = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
  };

  return (
    <UserContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      <PageContainer className="p-5">
        <ButtonContainer>
          {!isSignedIn ? (
            <>
              <LinkBtn onClick={handleShow}>Sign in</LinkBtn> to start chatting
              🙌
            </>
          ) : (
            <LinkBtn onClick={logout}>Logout</LinkBtn>
          )}
        </ButtonContainer>
        <LoginForm show={show} handleClose={handleClose} />
        <ChatRoom />
        {/* <ChatTest /> */}
      </PageContainer>
    </UserContext.Provider>
  );
}

export default App;

const PageContainer = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ButtonContainer = styled.h5`
  font-weight: 700;
  margin-bottom: 2rem;
`;

const LinkBtn = styled.button`
  border: none;
  background: none;
  outline: none;
  color: #5eb51a;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-style: dashed;
`;
