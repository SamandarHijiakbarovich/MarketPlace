import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../types/shop';
import type { Order as UiOrder } from '../types/shop';
import type { Category } from '../types/category';
import type { ProductPayload } from '../types/product';
import { productsApi, adminProductsApi } from '../api/products';
import { categoriesApi } from '../api/categories';
import { toProduct } from '../lib/mappers';
import { useToast } from './ToastContext';

interface DataContextValue {
  products: Product[];
  categories: Category[];
  loading: boolean; // katalog "yuklanmoqda" (skeleton) uchun
  error: boolean; // backend javob bermasa
  refreshProducts: () => Promise<void>;
  getProductDetail: (id: number) => Promise<Product>; // to'liq (tavsif bilan)
  createProduct: (payload: ProductPayload) => Promise<void>;
  updateProduct: (id: number, payload: ProductPayload) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  lastOrder: UiOrder | null; // muvaffaqiyat sahifasi uchun
  setLastOrder: (o: UiOrder | null) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastOrder, setLastOrder] = useState<UiOrder | null>(null);

  const refreshProducts = async () => {
    // Katalog uchun barcha mahsulotlarni bir marta olamiz — filtr/saralash frontendda.
    const res = await productsApi.getAll({ pageSize: 100 });
    setProducts(res.items.map(toProduct));
  };

  // Ilova ochilganda mahsulotlar + kategoriyalarni yuklaymiz
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const [, cats] = await Promise.all([refreshProducts(), categoriesApi.getAll()]);
        setCategories(cats);
      } catch (e) {
        console.error('Ma\'lumotlarni yuklashda xato:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductDetail = async (id: number) => toProduct(await productsApi.getById(id));

  const createProduct = async (payload: ProductPayload) => {
    await adminProductsApi.create(payload);
    await refreshProducts();
    toast("Mahsulot qo'shildi");
  };

  const updateProduct = async (id: number, payload: ProductPayload) => {
    await adminProductsApi.update(id, payload);
    await refreshProducts();
    toast('Mahsulot yangilandi');
  };

  const deleteProduct = async (id: number) => {
    await adminProductsApi.remove(id);
    await refreshProducts();
    toast("Mahsulot o'chirildi");
  };

  const value = useMemo<DataContextValue>(
    () => ({ products, categories, loading, error, refreshProducts, getProductDetail, createProduct, updateProduct, deleteProduct, lastOrder, setLastOrder }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, categories, loading, error, lastOrder],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData DataProvider ichida ishlatilishi kerak');
  return ctx;
}
