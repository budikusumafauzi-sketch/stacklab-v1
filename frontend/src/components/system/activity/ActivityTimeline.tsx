import { ActivityLog } from "../../../services/activity/api";
import { ActivityItem } from "./ActivityItem";

interface ActivityTimelineProps {
  activities: ActivityLog[];
  onRead?: (id: number) => void;
}

export function ActivityTimeline({ activities, onRead }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <span className="text-xl">📭</span>
        </div>
        <p>No activities to show</p>
        <p className="text-sm mt-1">Activities and system events will appear here.</p>
      </div>
    );
  }

  // Simple un-grouped list for now to ensure rapid rendering, could group by date later.
  return (
    <div className="flex flex-col space-y-3 p-4">
      {activities.map(activity => (
        <ActivityItem 
          key={activity.id} 
          activity={activity} 
          onRead={onRead}
        />
      ))}
    </div>
  );
}
