import { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "../../hooks/useNotifications";
import type { Notification } from "../../types/notifications";

export const NotificationList = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  // Fechar notificações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.notification-container')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRead = async (id: number) => {
    await markAsRead(id);
  };

  // Debug: verifique os dados recebidos
  console.log('Notificações:', notifications);
  console.log('Contagem não lida:', unreadCount);

  return (
    <div className="relative notification-container">
      <button 
        onClick={() => setOpen(!open)} 
        className=""
        aria-label="Notificações"
      >
        <BellIcon className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-auto border border-gray-200">
          <div className="sticky top-0 p-3 border-b bg-white flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notificações</h3>
            <button 
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Fechar notificações"
            >
              ×
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhuma notificação encontrada.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleRead(n.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{n.title}</h4>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <span className="text-xs text-gray-400 block mt-2">
                    {new Date(n.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};