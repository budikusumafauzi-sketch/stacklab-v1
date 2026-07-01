from typing import Any, Callable, Dict, List

class EventBus:
    def __init__(self):
        self.listeners: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, listener: Callable):
        if event_type not in self.listeners:
            self.listeners[event_type] = []
        self.listeners[event_type].append(listener)

    def publish(self, event_type: str, payload: Any):
        if event_type in self.listeners:
            for listener in self.listeners[event_type]:
                try:
                    listener(payload)
                except Exception as e:
                    # Log error but don't block
                    print(f"Error in listener for {event_type}: {e}")

workspace_events = EventBus()
