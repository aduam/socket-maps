import { createContext } from 'react';

import { useSocket } from '../hooks/use-socket';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, isOnline } = useSocket('http://localhost:2000');
  return (
    <SocketContext.Provider value={{ socket, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
};