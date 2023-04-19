import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 80%;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  max-width: 70%;
  background-color: #e1ffc7;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

const SentMessage = styled(Message)`
  align-self: flex-end;
  background-color: #dcf8c6;
`;

const AcknowledgeIcon = styled.span`
  font-size: 12px;
  color: gray;
  margin-left: 5px;
`;

const SeenIcon = styled.span`
  font-size: 12px;
  color: blue;
  margin-left: 5px;
`;

const TypingIndicator = styled.span`
  font-size: 0.8rem;
  color: gray;
  margin-left: 5px;
  margin-bottom: 8px;
  font-style: italic;
  height: 0.8rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 20%;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-top: 1px solid #ddd;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
`;

const ChatTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleInputValueChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        text: inputValue.trim(),
        sender: "me",
        sentTime: new Date(),
        seenTime: null,
      };
      setMessages((messages) => [...messages, newMessage]);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (isTyping) {
      const timeoutId = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTyping]);

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendButtonClick();
    } else if (!isTyping) {
      setIsTyping(true);
    }
  };

  const renderMessage = (message) => {
    const isSent = message.sender === "me";
    const acknowledgeIcon = message.sentTime ? (
      <AcknowledgeIcon>✓</AcknowledgeIcon>
    ) : null;
    const seenIcon = message.seenTime ? <SeenIcon>✓✓</SeenIcon> : null;
    const MessageComponent = isSent ? SentMessage : Message;
    return (
      <MessageComponent key={message.sentTime}>
        {message.text}
        <div>
          {acknowledgeIcon}
          {seenIcon}
        </div>
      </MessageComponent>
    );
  };

  return (
    <Container>
      <MessageContainer>
        {messages.map(renderMessage)}
        <TypingIndicator>{isTyping ? "typing..." : ""}</TypingIndicator>
      </MessageContainer>
      <InputContainer>
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleInputKeyDown}
        />
        <SendButton onClick={handleSendButtonClick}>Send</SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatTest;
