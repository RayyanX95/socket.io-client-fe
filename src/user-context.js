import React from "react";

export const UserContext = React.createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
  socket: null,
  setSocket: () => {},
  room: null,
  setRoomId: () => {},
  username: null,
  setUsername: () => {},
});
