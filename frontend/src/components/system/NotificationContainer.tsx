import { Notification } from "../../providers/notification/NotificationContext";
import { X, CheckCircle2, AlertCircle, Info } from "../../config/icons";
import { cn } from "../../lib/utils";

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export function NotificationContainer({ notifications, removeNotification }: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-4 rounded-lg border bg-background p-4 shadow-lg transition-all",
            notification.type === "success" && "border-green-500/20 bg-green-500/10",
            notification.type === "error" && "border-destructive/20 bg-destructive/10",
            notification.type === "warning" && "border-orange-500/20 bg-orange-500/10"
          )}
        >
          <div className="mt-0.5">
            {notification.type === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {notification.type === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
            {notification.type === "warning" && <AlertCircle className="h-5 w-5 text-orange-500" />}
            {notification.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
            {notification.message && (
              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
