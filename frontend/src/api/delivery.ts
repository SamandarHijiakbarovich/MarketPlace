import { apiClient } from './client';
import type { DeliveryOption } from '../types/delivery';

export const deliveryApi = {
  getOptions: () => apiClient.get<DeliveryOption[]>('/delivery/options').then((res) => res.data),
};
