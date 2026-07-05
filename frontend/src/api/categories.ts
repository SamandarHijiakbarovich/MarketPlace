import { apiClient } from './client';
import type { Category } from '../types/category';

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories').then((res) => res.data),
};
