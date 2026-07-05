import type { ShipMethod } from '../types/shop';

// "15990000" -> "15 990 000 so'm"
export function formatSom(value: number): string {
  return Math.round(value).toLocaleString('en-US').replace(/,/g, ' ') + " so'm";
}

// Ism -> bosh harflar (max 2 ta): "Jasur Karimov" -> "JK"
export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Hozirgi vaqt: "05.07.2026, 14:22"
export function nowText(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

// Taxminiy yetkazish sanasi: express -> +1 kun, standart -> +3 kun. "8 iyul"
export function etaText(method: ShipMethod): string {
  const days = method === 'express' ? 1 : 3;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function deliveryCost(method: ShipMethod): number {
  return method === 'express' ? 50000 : 25000;
}
