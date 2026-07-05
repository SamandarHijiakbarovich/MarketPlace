import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Har bir so'rovga avtomatik ravishda savat ID va (bo'lsa) admin JWT tokenini qo'shib yuboradi.
apiClient.interceptors.request.use((config) => {
  const cartId = localStorage.getItem('cartId');
  if (cartId) {
    config.headers['X-Cart-Id'] = cartId;
  }

  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
