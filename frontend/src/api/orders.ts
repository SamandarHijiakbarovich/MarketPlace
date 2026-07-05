import { apiClient } from './client';
import type { PagedResult } from '../types/common';
import type { CreateOrderPayload, Order, OrderStatus, OrderSummary } from '../types/order';

export const ordersApi = {
  checkout: (payload: CreateOrderPayload) =>
    apiClient.post<Order>('/orders', payload).then((res) => res.data),

  getById: (id: number) => apiClient.get<Order>(`/orders/${id}`).then((res) => res.data),
};

export const adminOrdersApi = {
  getAll: (page = 1, pageSize = 20) =>
    apiClient
      .get<PagedResult<OrderSummary>>('/admin/orders', { params: { page, pageSize } })
      .then((res) => res.data),

  getById: (id: number) => apiClient.get<Order>(`/admin/orders/${id}`).then((res) => res.data),

  updateStatus: (id: number, status: OrderStatus) =>
    apiClient.put<Order>(`/admin/orders/${id}/status`, { status }).then((res) => res.data),
};
