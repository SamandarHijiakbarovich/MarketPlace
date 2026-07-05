import { apiClient } from './client';
import type { DashboardStats } from '../types/admin';

export const adminDashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/admin/dashboard').then((res) => res.data),
};
