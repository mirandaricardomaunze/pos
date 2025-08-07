import { useEffect, useState, useCallback } from 'react';
import  io  from 'socket.io-client';
import { notificationService } from '../services/notificationService/notificationService';
import type { Notification } from '../types/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null); // ✅ Aqui

  const userId = localStorage.getItem('userId');

  const fetchData = useCallback(async () => {
    try {
      const [notifs, count] = await Promise.all([
        notificationService.getAll(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io('http://localhost:3000/notifications', {
      query: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to notifications server');
      fetchData();
    });

    newSocket.on('notification:new', (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('notification:count', (count: number) => {
      setUnreadCount(count);
    });

    newSocket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err.message);
    });

    newSocket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      newSocket.off('notification:new');
      newSocket.off('notification:count');
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('disconnect');
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [userId, fetchData]);

  return {
    notifications,
    unreadCount,
    markAsRead: notificationService.markAsRead,
    socket,
  };
};
