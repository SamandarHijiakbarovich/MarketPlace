// Frontend hozircha mustaqil ishlaydi (mock/seed data bilan).
// Bu tiplar dizayndagi ma'lumot shakliga mos. Backend ulanganda
// src/types/product.ts, order.ts kabi API tiplariga moslab o'giramiz.

export type CatKey = 'smartfon' | 'noutbuk' | 'quloqchin' | 'aksessuar';

export type Spec = [label: string, value: string];

export interface Product {
  id: number;
  name: string;
  cat: CatKey; // rang uchun (categoryName'dan chiqariladi)
  categoryId?: number; // backend'ga yuborish uchun (admin forma)
  categoryName?: string; // backend'dagi asl nom
  price: number;
  oldPrice: number | null;
  stock: number;
  rating?: number; // backend'da yo'q — ixtiyoriy (bo'lsa ko'rsatiladi)
  desc: string;
  specs?: Spec[]; // backend'da yo'q — ixtiyoriy
  img: string; // bo'sh bo'lsa — kategoriya rangli gradient ko'rsatiladi
}

export type OrderStatus = 'yangi' | 'tayyorlanmoqda' | 'yetkazildi' | 'bekor';

export interface OrderLine {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string; // masalan "#MP-1043"
  customer: string;
  phone: string;
  address: string;
  date: string;
  items: OrderLine[];
  delivery: number;
  total: number;
  status: OrderStatus;
  pay: string; // "Karta" | "Naqd"
  eta?: string;
}

export interface BuyerUser {
  name: string;
  email: string;
  phone: string;
  pass: string;
}

// Admin mahsulot qo'shish/tahrirlash formasi (barchasi matn — inputlardan keladi)
export interface ProductForm {
  name: string;
  desc: string;
  price: string;
  stock: string;
  cat: CatKey;
  img: string;
}

export type ShipMethod = 'standard' | 'express';
export type PayMethod = 'card' | 'cash';
