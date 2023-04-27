import React, { useEffect, useState } from "react";
import ChatRoom from "./components/chat";
import LoginForm from "./components/login-form.modal";
import styled from "styled-components";
import { UserContext } from "./user-context";
import RoomFormModal from "./components/room-form.modal";

function App() {
  const [show, setShowModal] = useState(false);
  const [showRoomModal, setRoomModal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState();
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCloseRoomModal = () => setRoomModal(false);
  const handleShowRoomModal = () => setRoomModal(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    console.log("token", token);
    if (token) {
      setIsSignedIn(true);
      setUsername(username);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
  };

  const handleLeaveRoom = () => {
    socket && socket.emit("leaveRoom", roomId);

    setRoomId();
  };

  return (
    <UserContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        socket,
        setSocket,
        roomId,
        setRoomId,
        username,
        setUsername,
      }}
    >
      <PageContainer>
        <ButtonContainer>
          {!isSignedIn ? (
            <>
              <LinkBtn onClick={handleShow}>Sign in</LinkBtn> to start chatting
              🙌
            </>
          ) : (
            <TopActions>
              {roomId ? (
                <LinkBtn onClick={handleLeaveRoom}>Leave Room</LinkBtn>
              ) : (
                <LinkBtn onClick={handleShowRoomModal}>
                  Create or Join Room
                </LinkBtn>
              )}
              <LinkBtn theme="red" onClick={() => logout(socket)}>
                Logout
              </LinkBtn>
            </TopActions>
          )}
        </ButtonContainer>
        <LoginForm show={show} handleClose={handleClose} />
        <RoomFormModal
          show={showRoomModal}
          handleClose={handleCloseRoomModal}
        />
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
  padding: 1rem 0;
`;

const ButtonContainer = styled.div`
  font-weight: 700;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const LinkBtn = styled.button`
  border: none;
  background: none;
  outline: none;
  color: ${(props) => (props.theme === "red" ? "#cc4e5c" : "#5eb51a")};
  font-weight: 700;
  text-decoration: underline;
  text-decoration-style: dashed;
`;

const TopActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  align-items: center;
`;
