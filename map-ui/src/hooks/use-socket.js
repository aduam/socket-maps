import { useState, useMemo, useEffect } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverPath) => {
  const socket = useMemo(() => {
    return io.connect(serverPath, { transports: ['websocket'] });
  }, [serverPath]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsOnline(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('disconnect', () => {
      setIsOnline(false);
    })
  }, [socket]);

  return {
    isOnline,
    socket,
  };
};