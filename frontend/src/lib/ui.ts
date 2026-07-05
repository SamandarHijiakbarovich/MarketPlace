import type { CSSProperties } from 'react';
import type { CatKey, OrderStatus } from '../types/shop';

// Asosiy brend ranglari (dizayndan)
export const PRIMARY = '#4F46E5';
export const PRIMARY_HOVER = '#4338CA';

// Kategoriya meta: nomi + gradient ranglari + matn rangi
interface CatMeta {
  label: string;
  c1: string;
  c2: string;
  tx: string;
}

export const CATS: Record<CatKey, CatMeta> = {
  smartfon: { label: 'Smartfonlar', c1: '#eef2ff', c2: '#e0e7ff', tx: '#4F46E5' },
  noutbuk: { label: 'Noutbuklar', c1: '#ecfdf5', c2: '#d1fae5', tx: '#059669' },
  quloqchin: { label: 'Quloqchinlar', c1: '#fff7ed', c2: '#ffedd5', tx: '#ea580c' },
  aksessuar: { label: 'Aksessuarlar', c1: '#fdf2f8', c2: '#fce7f3', tx: '#db2777' },
};

export function categoryMeta(k: CatKey): CatMeta {
  return CATS[k] ?? { label: k, c1: '#eef2ff', c2: '#e0e7ff', tx: PRIMARY };
}

// Rasmi yo'q mahsulot uchun kategoriya rangli gradient
export function thumbBg(k: CatKey): string {
  const c = categoryMeta(k);
  return `linear-gradient(135deg, ${c.c1} 0%, ${c.c2} 100%)`;
}

// Mahsulot rasmi bo'lsa — rasm, bo'lmasa — gradient (CSSProperties sifatida)
export function imageStyle(p: { img: string; cat: CatKey }): CSSProperties {
  if (p.img) {
    return {
      backgroundImage: `url('${p.img}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { background: thumbBg(p.cat) };
}

// Buyurtma status meta
interface StatusMeta {
  label: string;
  bg: string;
  tx: string;
}

const STATUS: Record<OrderStatus, StatusMeta> = {
  yangi: { label: 'Yangi', bg: '#dbeafe', tx: '#1d4ed8' },
  tayyorlanmoqda: { label: 'Tayyorlanmoqda', bg: '#fef3c7', tx: '#b45309' },
  yetkazildi: { label: 'Yetkazildi', bg: '#dcfce7', tx: '#15803d' },
  bekor: { label: 'Bekor qilingan', bg: '#fee2e2', tx: '#b91c1c' },
};

export function statusMeta(st: OrderStatus): StatusMeta {
  return STATUS[st] ?? STATUS.yangi;
}

export function badgeStyle(st: OrderStatus): CSSProperties {
  const m = statusMeta(st);
  return {
    background: m.bg,
    color: m.tx,
    padding: '5px 11px',
    borderRadius: '20px',
    fontSize: '12.5px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    display: 'inline-block',
  };
}

export const ALL_STATUSES: OrderStatus[] = ['yangi', 'tayyorlanmoqda', 'yetkazildi', 'bekor'];
