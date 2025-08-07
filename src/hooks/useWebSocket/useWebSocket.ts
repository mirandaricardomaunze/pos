// src/hooks/useWebSocket.ts
import { useEffect } from 'react';
import  io from 'socket.io-client';

const useWebSocket = (url: string, handlers: Record<string, (data: any) => void>) => {
  useEffect(() => {
    const socket= io(url);

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, handlers]);
};

export default useWebSocket;