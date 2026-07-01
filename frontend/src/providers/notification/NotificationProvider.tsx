import React, { useState, useCallback } from "react";
import { NotificationContext, Notification } from "./NotificationContext";
import { NotificationContainer } from "@/components/system/NotificationContainer";
import { notificationService } from "../../services/notification";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = crypto.randomUUID();
    const newNotification = { 
      ...notification, 
      id, 
      timestamp: Date.now(),
      read: false 
    };
    
    setNotifications((prev) => [...prev, newNotification]);
    setHistory((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, [removeNotification]);

  const markAsRead = useCallback((id: string) => {
    setHistory((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  React.useEffect(() => {
    notificationService.setDispatcher(addNotification);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, history, addNotification, removeNotification, markAsRead, clearHistory }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
}
