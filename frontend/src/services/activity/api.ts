import { internalApi } from '../api/internal';
import { ActivityCategory, ActivityType } from './dispatcher';

export interface ActivityLog {
  id: number;
  user_id: number;
  type: ActivityType;
  category: ActivityCategory;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedActivityResponse {
  items: ActivityLog[];
  total: number;
  page: number;
  size: number;
}

export const activityService = {
  async getActivities(params: {
    skip?: number;
    limit?: number;
    type?: ActivityType;
    category?: ActivityCategory;
    search?: string;
  } = {}): Promise<PaginatedActivityResponse> {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.type) searchParams.append('type', params.type);
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const url = `/activity${queryString ? `?${queryString}` : ''}`;
    
    return internalApi.get(url) as Promise<PaginatedActivityResponse>;
  },

  async logActivity(data: {
    type: ActivityType;
    category: ActivityCategory;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog> {
    return internalApi.post('/activity', data) as Promise<ActivityLog>;
  },

  async markAsRead(id: number): Promise<ActivityLog> {
    return internalApi.patch(`/activity/${id}/read`, {}) as Promise<ActivityLog>;
  },

  async markAllAsRead(): Promise<{ updated: number }> {
    return internalApi.patch('/activity/read-all', {}) as Promise<{ updated: number }>;
  },

  async deleteActivity(id: number): Promise<void> {
    return internalApi.delete(`/activity/${id}`) as Promise<void>;
  }
};
