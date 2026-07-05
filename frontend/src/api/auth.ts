import { apiClient } from './client';
import type { LoginPayload, LoginResponse } from '../types/auth';

export const authApi = {
  // Muvaffaqiyatli login'da token'ni localStorage'ga saqlaymiz — client.ts interceptor
  // uni keyingi so'rovlarda avtomatik Authorization header sifatida yuboradi.
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload).then((res) => {
      localStorage.setItem('adminToken', res.data.token);
      return res.data;
    }),
};
