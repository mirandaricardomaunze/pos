
import { useEffect, useRef } from 'react';

type WebSocketEvents = {
  order_created?: (data: any) => void;
  order_updated?: (data: any) => void;
};

const useWebSocket = (url: string, events: WebSocketEvents) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('🔌 Conectado ao WebSocket');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const { event: eventType, data } = parsed;

        if (eventType && events[eventType as keyof WebSocketEvents]) {
          events[eventType as keyof WebSocketEvents]?.(data);
        }
      } catch (err) {
        console.error('Erro ao processar mensagem WebSocket:', err);
      }
    };

    socketRef.current.onclose = () => {
      console.warn('🛑 WebSocket desconectado');
    };

    socketRef.current.onerror = (err) => {
      console.error('Erro no WebSocket:', err);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);
};

export default useWebSocket;
