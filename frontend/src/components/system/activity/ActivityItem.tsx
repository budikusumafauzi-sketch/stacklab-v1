import { ActivityLog } from "../../../services/activity/api";
import { ActivityBadge } from "./ActivityBadge";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

interface ActivityItemProps {
  activity: ActivityLog;
  onRead?: (id: number) => void;
}

export function ActivityItem({ activity, onRead }: ActivityItemProps) {
  return (
    <div 
      className={`relative p-4 rounded-lg border transition-all ${
        activity.is_read 
          ? "bg-card border-border/50 opacity-80" 
          : "bg-primary/5 border-primary/20 shadow-sm"
      }`}
      onClick={() => {
        if (!activity.is_read && onRead) {
          onRead(activity.id);
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {!activity.is_read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          <ActivityBadge type={activity.type} />
          <span className="text-xs text-muted-foreground ml-2">
            {formatRelativeTime(activity.created_at)}
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/50">
          {activity.category}
        </div>
      </div>
      
      <h4 className="text-sm font-semibold mb-1 text-foreground">{activity.title}</h4>
      {activity.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
      )}
    </div>
  );
}
