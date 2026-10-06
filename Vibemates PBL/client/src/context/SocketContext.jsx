import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    // Only connect if user is authenticated
    if (user && user._id) {
      const newSocket = io(window.location.origin, {
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      newSocket.on('connect', () => {
        newSocket.emit('join_user', user._id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
