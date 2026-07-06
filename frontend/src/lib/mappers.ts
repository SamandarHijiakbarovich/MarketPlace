import type { ProductDetail, ProductListItem } from '../types/product';
import type { Order as ApiOrder, OrderStatus as ApiOrderStatus } from '../types/order';
import type { CatKey, Order as UiOrder, OrderStatus as UiOrderStatus, Product } from '../types/shop';

// ---- Kategoriya nomidan rang kaliti (CatKey) ----
// Backend kategoriyalari dinamik (id/nom), UI esa ranglash uchun CatKey ishlatadi.
export function catKeyFromName(name: string): CatKey {
  const n = (name || '').toLowerCase();
  if (n.includes('smartfon') || n.includes('telefon')) return 'smartfon';
  if (n.includes('noutbuk') || n.includes('laptop')) return 'noutbuk';
  if (n.includes('quloqchin') || n.includes('audio') || n.includes('naushnik')) return 'quloqchin';
  return 'aksessuar';
}

// ---- Backend mahsulot -> UI Product ----
// ProductListItem (ro'yxat) va ProductDetail (to'liq) ikkalasi uchun ham ishlaydi.
export function toProduct(dto: ProductListItem | ProductDetail): Product {
  const desc = 'description' in dto ? dto.description : '';
  const categoryId = 'categoryId' in dto ? dto.categoryId : undefined;
  return {
    id: dto.id,
    name: dto.name,
    cat: catKeyFromName(dto.categoryName),
    categoryId,
    categoryName: dto.categoryName,
    price: dto.price,
    oldPrice: null, // backend'da chegirma (eski narx) yo'q
    stock: dto.stock,
    desc,
    img: dto.imageUrl,
    // rating va specs backend'da yo'q — bermaymiz (UI ularsiz ham ishlaydi)
  };
}

// ---- Buyurtma statusi: inglizcha <-> o'zbekcha ----
const EN_TO_UZ: Record<ApiOrderStatus, UiOrderStatus> = {
  New: 'yangi',
  Preparing: 'tayyorlanmoqda',
  Delivered: 'yetkazildi',
  Cancelled: 'bekor',
};

const UZ_TO_EN: Record<UiOrderStatus, ApiOrderStatus> = {
  yangi: 'New',
  tayyorlanmoqda: 'Preparing',
  yetkazildi: 'Delivered',
  bekor: 'Cancelled',
};

export const statusEnToUz = (s: ApiOrderStatus): UiOrderStatus => EN_TO_UZ[s];
export const statusUzToEn = (s: UiOrderStatus): ApiOrderStatus => UZ_TO_EN[s];

// ---- Sana formati: ISO -> "05.07.2026, 14:22" ----
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

// ISO -> "8 iyul"
export function formatDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// To'lov usuli yorlig'i (buyurtma detali/muvaffaqiyat sahifasi uchun)
const PAY_LABEL: Record<string, string> = {
  Card: 'Karta',
  CashOnDelivery: 'Naqd',
  Click: 'Click',
  Payme: 'Payme',
};

// ---- Backend buyurtma (to'liq) -> UI Order ----
export function toOrder(o: ApiOrder): UiOrder {
  return {
    id: o.orderNumber,
    customer: o.delivery.fullName,
    phone: o.delivery.phone,
    address: o.delivery.address,
    date: formatDateTime(o.createdAt),
    items: o.items.map((i) => ({ name: i.productName, qty: i.quantity, price: i.unitPrice })),
    delivery: o.deliveryCost,
    total: o.total,
    status: statusEnToUz(o.status),
    pay: PAY_LABEL[o.paymentMethod] ?? o.paymentMethod,
    eta: formatDay(o.delivery.estimatedDeliveryDate),
  };
}
