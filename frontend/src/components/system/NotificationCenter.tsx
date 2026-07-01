import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../../providers/notification/NotificationContext';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Info } from '../../config/icons';

export function NotificationCenter() {
  const { history, markAsRead, clearHistory } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = history.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-destructive border-2 border-background" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover shadow-lg z-50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              history.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 border-b last:border-0 hover:bg-accent/50 cursor-pointer transition-colors",
                    !notification.read && "bg-accent/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    {notification.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {notification.type === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {notification.type === "warning" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                    {notification.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                    )}
                    {notification.timestamp && (
                      <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="shrink-0 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
