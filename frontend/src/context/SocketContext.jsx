// import React, { createContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { BASE_URL } from "../api/apiservice";

// const SocketContext = createContext();

// const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(BASE_URL);

//     newSocket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     setSocket(newSocket);

//     // Clean up socket connection on unmount
//     return () => {
//       newSocket.disconnect();
//       console.log("Socket disconnected");
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export { SocketContext, SocketProvider };

import React, { createContext, useEffect, useState } from "react";
import socket from "../context/socket"; 

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
