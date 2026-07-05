import type { DeliveryAddress, DeliveryMethod } from './delivery';

export type PaymentMethod = 'Card' | 'CashOnDelivery';
export type OrderStatus = 'New' | 'Preparing' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed';

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

// Buyurtma ichidagi yetkazib berish ma'lumoti (backend OrderDeliveryDto)
export interface OrderDelivery {
  fullName: string;
  phone: string;
  address: string;
  method: DeliveryMethod;
  cost: number;
  estimatedDeliveryDate: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  delivery: OrderDelivery;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderPayload {
  cartId: string;
  deliveryAddress: DeliveryAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
}
