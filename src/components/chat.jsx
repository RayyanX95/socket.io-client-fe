import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import { BsSendFill } from "react-icons/bs";
import styled from "styled-components";
import { RiEmotionLaughFill } from "react-icons/ri";
import { UserContext } from "../user-context";

// const remoteUrl = "https://chat-runtime-with-video.onrender.com";
const localUrl = "http://localhost:5000";

const token = JSON.parse(localStorage.getItem("token"));

let options = {};
if (token) {
  options.auth = { token };
}
const socket = io(localUrl, options);

function ChatRoom() {
  const chatLeastBottom = useRef();
  const chatTextBox = useRef();

  const { isSignedIn, setSocket, roomId, username } = useContext(UserContext);

  // const [remoteMessages, setRemoteMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  // const [localMessages, setLocalMessages] = useState([]);
  const [messagesStack, setMessagesStack] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);

  const onMessageHandler = () => {
    socket &&
      socket.on("message", (data) => {
        // setRemoteMessages((messages) => [...messages, data]);
        setMessagesStack((messages) => [...messages, data]);
      });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const message = {
      sender: {
        id: username,
        name: username,
      },
      content: messageText,
      timestamp: Date.now(),
      type: "text",
      status: "",
      roomId: roomId,
    };

    socket && socket.emit("message", message);
    // setLocalMessages((localMessages) => [...localMessages, messageText]);
    setMessagesStack((messages) => [...messages, message]);
    setMessageText("");
  };

  const focusChatTextBox = () => chatTextBox.current.focus();
  const scrollToChatLeastBottom = () =>
    chatLeastBottom.current.scrollIntoView({
      behavior: "smooth",
    });

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(event);
    } else if (!isTyping) {
      setIsTyping(true);
      socket && socket.emit("typing", true);
    }
  };

  useEffect(() => {
    onMessageHandler();
    socket &&
      socket.on("typing", (data) => {
        setIsRemoteTyping(data);
      });

    socket && setSocket(socket);
  }, [setSocket]);

  useEffect(() => {
    isSignedIn && focusChatTextBox();
  }, [isSignedIn]);

  useEffect(() => {
    scrollToChatLeastBottom();
    // focusChatTextBox();
  }, [messagesStack]);

  useEffect(() => {
    if (isTyping) {
      const timeoutId = setTimeout(() => {
        setIsTyping(false);
        socket && socket.emit("typing", false);
      }, 1500);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTyping]);

  return (
    <ChatContainer style={{ maxWidth: 700 }} isSignedIn={isSignedIn}>
      <ChatHeader>
        <h6>Start Chatting ✌️</h6>
        {isRemoteTyping && <Typing>typing...</Typing>}
      </ChatHeader>
      <ChatBody>
        <ChatList>
          <ChatMessages>
            <Alert>
              <small>Let's be in touch 🤙</small>
            </Alert>
            {messagesStack.map((message, index) => {
              return message.sender?.id !== username ? (
                <div className="message incoming" key={index}>
                  <div className="message-bubble incoming">
                    <p>{message.content}</p>
                    <small>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ) : (
                <div className="message outgoing" key={index}>
                  <div className="message-bubble outgoing">
                    <p>{message.content}</p>
                    <small>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              );
            })}
          </ChatMessages>
          <div style={{ height: 20 }}></div>
          <div ref={chatLeastBottom} id="chat-least-bottom"></div>
        </ChatList>
      </ChatBody>
      <ChatInput>
        <form onSubmit={handleSendMessage}>
          <button type="button">
            <RiEmotionLaughFill color="#a6b297" size={28} />
          </button>
          <TextInput
            type="text"
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Type a message..."
            value={messageText}
            ref={chatTextBox}
            onKeyDown={handleInputKeyDown}
          />
          <SendButton
            type="submit"
            disabled={!messageText}
            onClick={() => console.log("Test")}
          >
            <BsSendFill size={32} />
          </SendButton>
        </form>
      </ChatInput>

      {!isSignedIn && <OverlayChat />}
    </ChatContainer>
  );
}

export default React.memo(ChatRoom);

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  border-radius: 0.4rem;
  background-color: #fff;
  filter: ${(props) => `blur(${props.isSignedIn ? "0" : "3.5px"})`};
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(0, 0, 0, 0.15);

  @media (max-width: 499px) {
    width: 94%;
  }
`;

const OverlayChat = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: aliceblue;
  opacity: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 3.5rem;
  padding: 0.3rem 1rem;
  border-bottom: 1px solid #dcdcdc;
  background-color: rgb(94, 181, 26);
  border-radius: 0.4rem 0.4rem 0 0;

  h6 {
    margin: 0;
    color: #d8ddd4;
  }
`;

const ChatBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 60vh;
`;

const Alert = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #ecf3e6;
  border-radius: 0.2rem;
  font-weight: bold;
`;

const ChatList = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 12px;
    display: none;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
  padding: 1rem;
`;

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 2.5s;

  .message {
    display: flex;
    gap: 0.5rem;
    max-width: 80%;

    &.incoming {
      align-self: flex-start;
      opacity: 1;
    }

    &.outgoing {
      align-self: flex-end;
    }
  }

  .message-bubble {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    word-wrap: break-word;

    &.incoming {
      /* background-color: #e4e4e4; */
      background-color: #f2f2f2;
    }

    &.outgoing {
      background-color: #dcf8c6;
    }
  }

  .header {
    background-color: #c8deef;
  }

  small {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: gray;
  }
`;

const ChatInput = styled.div`
  form {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #dcdcdc;

    button {
      border: none;
      background-color: transparent;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    input {
      flex-grow: 1;
      margin: 0 0.2rem;
      border: none;
      font-size: 1rem;

      &:focus {
        outline: none;
      }
    }

    @media (max-width: 499px) {
      padding: 0.5rem;
    }
  }
`;

const SendButton = styled.button`
  color: #5eb51a;
  transition: all 0.5s;

  &:active:not(:disabled) {
    transform: scale(1.3);
  }

  &:disabled {
    color: #aaa;
  }
`;

const TextInput = styled.input`
  background-color: #dcf8c6;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  width: 70%;
`;

const Typing = styled.small`
  color: #dcf8c6;
  font-style: italic;
`;
