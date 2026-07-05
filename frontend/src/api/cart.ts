import { apiClient } from './client';
import type { Cart } from '../types/cart';

// Har javobdan keyin cartId'ni localStorage'ga saqlaymiz — client.ts interceptor uni
// X-Cart-Id header sifatida yuboradi. Birinchi qo'shishda cartId bo'lmaydi -> backend
// yangi savat yaratib, uning ID'sini qaytaradi.
function save(cart: Cart): Cart {
  localStorage.setItem('cartId', cart.cartId);
  return cart;
}

export const cartApi = {
  get: () => apiClient.get<Cart>('/cart').then((res) => save(res.data)),

  addItem: (productId: number, quantity: number) =>
    apiClient.post<Cart>('/cart/items', { productId, quantity }).then((res) => save(res.data)),

  updateItem: (productId: number, quantity: number) =>
    apiClient.put<Cart>(`/cart/items/${productId}`, { quantity }).then((res) => save(res.data)),

  removeItem: (productId: number) =>
    apiClient.delete<Cart>(`/cart/items/${productId}`).then((res) => save(res.data)),
};
