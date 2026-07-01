import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle, X } from "lucide-react";
import { Button } from "../../ui/button";
import { useActivity } from "../../../providers/activity/ActivityContext";
import { ActivityTimeline } from "./ActivityTimeline";
import { ActivityFilter } from "./ActivityFilter";

export function ActivityCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { 
    activities, 
    total,
    loading, 
    hasMore,
    filters,
    setFilters,
    loadMore,
    markAsRead,
    markAllAsRead
  } = useActivity();

  const unreadCount = activities.filter(a => !a.is_read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <div className="relative z-50">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <div 
          ref={panelRef}
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-xl flex flex-col h-[600px] max-h-[80vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div>
              <h3 className="font-semibold text-lg">Activity Center</h3>
              <p className="text-xs text-muted-foreground">{total} total events</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={unreadCount === 0}
                title="Mark all as read"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Read All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ActivityFilter 
            currentType={filters.type}
            currentCategory={filters.category}
            currentSearch={filters.search}
            onTypeChange={(type) => setFilters({ type })}
            onCategoryChange={(category) => setFilters({ category })}
            onSearchChange={(search) => setFilters({ search })}
          />

          <div 
            className="flex-1 overflow-y-auto bg-muted/10"
            onScrollCapture={handleScroll}
          >
            <ActivityTimeline 
              activities={activities} 
              onRead={(id) => markAsRead(id)} 
            />
            
            {loading && (
              <div className="flex justify-center p-4">
                <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            )}
            
            {!hasMore && activities.length > 0 && (
              <div className="text-center p-4 text-xs text-muted-foreground">
                No more activities
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
