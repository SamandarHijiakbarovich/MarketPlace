import { apiClient } from './client';
import type { PagedResult } from '../types/common';
import type { ProductDetail, ProductListItem, ProductPayload, ProductQueryParams } from '../types/product';

/**
 * NAMUNA (reference) — qolgan api/*.ts fayllarni (categories, cart, orders, delivery, auth)
 * shu naqshga qarab yozing: apiClient.get/post/put/delete chaqirasiz, .then(res => res.data)
 * bilan faqat kerakli ma'lumotni qaytarasiz.
 */
export const productsApi = {
  getAll: (params: ProductQueryParams = {}) =>
    apiClient.get<PagedResult<ProductListItem>>('/products', { params }).then((res) => res.data),

  getById: (id: number) => apiClient.get<ProductDetail>(`/products/${id}`).then((res) => res.data),
};

export const adminProductsApi = {
  getAll: (params: ProductQueryParams = {}) =>
    apiClient.get<PagedResult<ProductListItem>>('/admin/products', { params }).then((res) => res.data),

  getById: (id: number) => apiClient.get<ProductDetail>(`/admin/products/${id}`).then((res) => res.data),

  create: (payload: ProductPayload) =>
    apiClient.post<ProductDetail>('/admin/products', payload).then((res) => res.data),

  update: (id: number, payload: ProductPayload) =>
    apiClient.put<ProductDetail>(`/admin/products/${id}`, payload).then((res) => res.data),

  remove: (id: number) => apiClient.delete(`/admin/products/${id}`),
};
