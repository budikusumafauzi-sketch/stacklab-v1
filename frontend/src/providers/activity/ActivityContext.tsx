import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { activityService, ActivityLog } from '../../services/activity/api';
import { ActivityCategory, ActivityType } from '../../services/activity/dispatcher';

interface ActivityContextState {
  activities: ActivityLog[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  filters: {
    type?: ActivityType;
    category?: ActivityCategory;
    search?: string;
  };
  setFilters: (filters: Partial<ActivityContextState['filters']>) => void;
  loadMore: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextState | undefined>(undefined);

const PAGE_SIZE = 50;

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFiltersState] = useState<ActivityContextState['filters']>({});

  const setFilters = useCallback((newFilters: Partial<ActivityContextState['filters']>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(0);
    setActivities([]);
    setHasMore(true);
  }, []);

  const fetchActivities = useCallback(async (pageNum: number, currentActivities: ActivityLog[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.getActivities({
        skip: pageNum * PAGE_SIZE,
        limit: PAGE_SIZE,
        type: filters.type,
        category: filters.category,
        search: filters.search
      });
      
      if (pageNum === 0) {
        setActivities(response.items);
      } else {
        setActivities([...currentActivities, ...response.items]);
      }
      
      setTotal(response.total);
      setHasMore(response.items.length === PAGE_SIZE);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchActivities(nextPage, activities);
  }, [loading, hasMore, page, activities, fetchActivities]);

  const refresh = useCallback(async () => {
    setPage(0);
    setHasMore(true);
    await fetchActivities(0, []);
  }, [fetchActivities]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await activityService.markAsRead(id);
      setActivities(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error("Failed to mark activity as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await activityService.markAllAsRead();
      setActivities(prev => prev.map(a => ({ ...a, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all activities as read:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActivities(0, []);
  }, [fetchActivities]);

  // Listen to local dispatch events
  useEffect(() => {
    const handleNewActivity = () => {
      refresh();
    };
    window.addEventListener('activity:new', handleNewActivity);
    return () => {
      window.removeEventListener('activity:new', handleNewActivity);
    };
  }, [refresh]);

  return (
    <ActivityContext.Provider value={{
      activities,
      total,
      loading,
      error,
      hasMore,
      filters,
      setFilters,
      loadMore,
      markAsRead,
      markAllAsRead,
      refresh
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
