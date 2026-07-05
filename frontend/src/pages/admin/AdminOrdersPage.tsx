import { useEffect, useState, type CSSProperties } from 'react';
import type { OrderStatus as ApiOrderStatus, OrderSummary } from '../../types/order';
import type { Order as UiOrder, OrderStatus as UiOrderStatus } from '../../types/shop';
import { adminOrdersApi } from '../../api/orders';
import { formatSom } from '../../lib/format';
import { formatDateTime, statusEnToUz, statusUzToEn, toOrder } from '../../lib/mappers';
import { ALL_STATUSES, badgeStyle, statusMeta } from '../../lib/ui';

type FilterKey = 'all' | ApiOrderStatus;
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Barchasi' },
  { key: 'New', label: 'Yangi' },
  { key: 'Preparing', label: 'Tayyorlanmoqda' },
  { key: 'Delivered', label: 'Yetkazildi' },
  { key: 'Cancelled', label: 'Bekor' },
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewId, setViewId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UiOrder | null>(null);

  const load = () => adminOrdersApi.getAll(1, 100).then((r) => setOrders(r.items)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openOrder = async (id: number) => {
    setViewId(id);
    setDetail(null);
    const order = await adminOrdersApi.getById(id);
    setDetail(toOrder(order));
  };

  const changeStatus = async (uz: UiOrderStatus) => {
    if (viewId == null) return;
    const order = await adminOrdersApi.updateStatus(viewId, statusUzToEn(uz));
    setDetail(toOrder(order));
    load(); // ro'yxatdagi badge ham yangilansin
  };

  const rows = orders.filter((o) => filter === 'all' || o.status === filter);

  return (
    <div>
      {/* Filtrlar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '8px 15px', borderRadius: '9px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', border: '1px solid ' + (active ? '#4F46E5' : '#e5e7eb'), background: active ? '#4F46E5' : '#fff', color: active ? '#fff' : '#374151' }}>
              {f.label}
            </button>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
            <thead>
              <tr style={{ background: '#fafafc', textAlign: 'left', color: '#6b7280', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Buyurtma</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Mijoz</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Sana</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Summa</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }} />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '30px 18px', textAlign: 'center', color: '#9ca3af' }}>Buyurtma yo'q</td></tr>
              )}
              {rows.map((o) => {
                const uz = statusEnToUz(o.status);
                return (
                  <tr key={o.id} style={{ borderTop: '1px solid #f2f2f7' }}>
                    <td style={{ padding: '13px 18px', fontWeight: 700, fontSize: '13.5px' }}>{o.orderNumber}</td>
                    <td style={{ padding: '13px 18px', fontSize: '14px' }}>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '12.5px', color: '#9ca3af' }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: '13px 18px', color: '#6b7280', fontSize: '13.5px' }}>{formatDateTime(o.createdAt)}</td>
                    <td style={{ padding: '13px 18px', fontWeight: 700, fontSize: '14px' }}>{formatSom(o.total)}</td>
                    <td style={{ padding: '13px 18px' }}><span style={badgeStyle(uz)}>{statusMeta(uz).label}</span></td>
                    <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                      <button onClick={() => openOrder(o.id)} style={{ background: '#eef0ff', color: '#4F46E5', border: 'none', padding: '7px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Ko'rish</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyurtma detali modal */}
      {viewId != null && (
        <OrderModal order={detail} onClose={() => { setViewId(null); setDetail(null); }} onStatus={changeStatus} />
      )}
    </div>
  );
}

function OrderModal({ order, onClose, onStatus }: { order: UiOrder | null; onClose: () => void; onStatus: (st: UiOrderStatus) => void }) {
  const overlay: CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,12,40,0.5)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'grid', placeItems: 'center', padding: '20px' };
  const capLabel: CSSProperties = { fontSize: '12.5px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '8px' };

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto', padding: '26px' }}>
        {!order ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>Yuklanmoqda...</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{order.id}</h2>
              <button onClick={onClose} style={{ background: '#f2f2f7', border: 'none', width: '34px', height: '34px', borderRadius: '9px', fontSize: '17px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '13.5px', margin: '0 0 20px' }}>{order.date}</p>

            <div style={{ background: '#f7f7fb', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <div style={capLabel}>Yetkazib berish</div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{order.customer}</div>
              <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '2px' }}>{order.phone}</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>{order.address}</div>
            </div>

            <div style={capLabel}>Mahsulotlar</div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
              {order.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f2f2f7', fontSize: '14px' }}>
                  <span>{it.name} <span style={{ color: '#9ca3af' }}>× {it.qty}</span></span>
                  <span style={{ fontWeight: 700 }}>{formatSom(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #ececf3', fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>
              <span>Jami</span><span>{formatSom(order.total)}</span>
            </div>

            <div style={capLabel}>Statusni o'zgartirish</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ALL_STATUSES.map((st) => {
                const m = statusMeta(st);
                const active = order.status === st;
                return (
                  <button key={st} onClick={() => onStatus(st)} style={{ padding: '9px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: active ? `2px solid ${m.tx}` : '1px solid #e5e7eb', background: active ? m.bg : '#fff', color: active ? m.tx : '#6b7280' }}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
