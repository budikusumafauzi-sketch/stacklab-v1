import { Notification } from "../../providers/notification/NotificationContext";

type Dispatcher = (notification: Omit<Notification, "id">) => void;

class NotificationService {
  private dispatcher: Dispatcher | null = null;
  private queue: Omit<Notification, "id">[] = [];

  setDispatcher(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher;
    this.queue.forEach((n) => dispatcher(n));
    this.queue = [];
  }

  show(notification: Omit<Notification, "id">) {
    if (this.dispatcher) {
      this.dispatcher(notification);
    } else {
      this.queue.push(notification);
    }
  }

  success(title: string, message?: string) {
    this.show({ type: "success", title, message });
  }

  error(title: string, message?: string) {
    this.show({ type: "error", title, message });
  }

  info(title: string, message?: string) {
    this.show({ type: "info", title, message });
  }

  warning(title: string, message?: string) {
    this.show({ type: "warning", title, message });
  }
}

export const notificationService = new NotificationService();
