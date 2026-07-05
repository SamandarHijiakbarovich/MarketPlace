export type DeliveryMethod = 'Standard' | 'Express';

export interface DeliveryOption {
  method: string;
  cost: number;
  etaDays: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
}
