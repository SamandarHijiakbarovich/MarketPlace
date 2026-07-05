export interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  total: number;
}
