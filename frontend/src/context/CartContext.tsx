import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Cart } from '../types/cart';
import { cartApi } from '../api/cart';
import { useToast } from './ToastContext';

interface CartContextValue {
  cart: Cart | null;
  count: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  changeQty: (productId: number, delta: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clear: () => void;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function errMessage(e: unknown): string {
  // Backend BadRequestException matnini olishga urinamiz (masalan "Omborda faqat 3 dona qoldi")
  const anyErr = e as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? 'Xatolik yuz berdi';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const count = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCart(data);
    } catch (e) {
      console.warn('Savat yuklanmadi:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      setCart(await cartApi.addItem(productId, quantity));
      toast("Savatga qo'shildi");
    } catch (e) {
      toast(errMessage(e));
    }
  };

  const changeQty = async (productId: number, delta: number) => {
    const current = cart?.items.find((i) => i.productId === productId)?.quantity ?? 0;
    const next = current + delta;
    try {
      if (next <= 0) {
        setCart(await cartApi.removeItem(productId));
      } else {
        setCart(await cartApi.updateItem(productId, next));
      }
    } catch (e) {
      toast(errMessage(e));
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setCart(await cartApi.removeItem(productId));
    } catch (e) {
      toast(errMessage(e));
    }
  };

  // Checkout muvaffaqiyatli bo'lgach backend savatni bo'shatadi — lokal holatni ham tozalaymiz
  const clear = () => setCart((c) => (c ? { ...c, items: [], total: 0 } : c));

  return (
    <CartContext.Provider value={{ cart, count, loading, addToCart, changeQty, removeFromCart, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart CartProvider ichida ishlatilishi kerak');
  return ctx;
}
