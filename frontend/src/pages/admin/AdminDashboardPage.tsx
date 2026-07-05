import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardStats } from '../../types/admin';
import type { OrderSummary } from '../../types/order';
import { adminDashboardApi } from '../../api/admin';
import { adminOrdersApi } from '../../api/orders';
import { formatSom } from '../../lib/format';
import { statusEnToUz } from '../../lib/mappers';
import { badgeStyle, statusMeta } from '../../lib/ui';

const CHART: [string, number][] = [
  ['Du', 18], ['Se', 24], ['Ch', 15], ['Pa', 30], ['Ju', 27], ['Sh', 34], ['Ya', 22],
];

export function AdminDashboardPage() {
  const nav = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<OrderSummary[]>([]);

  useEffect(() => {
    adminDashboardApi.getStats().then(setStats).catch(() => {});
    adminOrdersApi.getAll(1, 5).then((r) => setRecent(r.items)).catch(() => {});
  }, []);

  const cards = [
    { icon: '🧾', iconBg: '#eef2ff', value: String(stats?.totalOrders ?? '—'), label: 'Jami buyurtmalar', trend: '+12%', up: true },
    { icon: '💰', iconBg: '#ecfdf5', value: stats ? formatSom(stats.totalRevenue) : '—', label: 'Umumiy savdo', trend: '+8%', up: true },
    { icon: '🆕', iconBg: '#fff7ed', value: String(stats?.newOrders ?? '—'), label: 'Yangi buyurtmalar', trend: 'bugun', up: true },
    { icon: '📦', iconBg: '#fdf2f8', value: String(stats?.productsCount ?? '—'), label: 'Mahsulotlar', trend: 'jami', up: false },
  ];

  const maxV = Math.max(...CHART.map((d) => d[1]));

  return (
    <div>
      {/* Stat kartalari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '26px' }}>
        {cards.map((st, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'grid', placeItems: 'center', fontSize: '22px', background: st.iconBg }}>{st.icon}</span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: st.up ? '#16a34a' : '#9ca3af', background: st.up ? '#f0fdf4' : '#f3f4f6', padding: '3px 8px', borderRadius: '6px' }}>{st.trend}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}>{st.value}</div>
            <div style={{ color: '#6b7280', fontSize: '13.5px', marginTop: '2px' }}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className="mp-stack" style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
        {/* Grafik (statik demo) */}
        <div className="mp-full-sm" style={{ flex: 1, minWidth: 0, background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>Haftalik savdo</h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 22px' }}>Oxirgi 7 kun · mln so'm</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
            {CHART.map(([day, val]) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div title={`${val} mln`} style={{ width: '100%', borderRadius: '8px 8px 0 0', background: 'linear-gradient(180deg,#6D5AE6,#4F46E5)', height: `${Math.round((val / maxV) * 100)}%` }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Oxirgi buyurtmalar */}
        <div className="mp-full-sm" style={{ width: '400px', flexShrink: 0, background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Oxirgi buyurtmalar</h3>
            <button onClick={() => nav('/admin/orders')} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Barchasi →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.length === 0 && <div style={{ color: '#9ca3af', fontSize: '13.5px', padding: '12px 0' }}>Hozircha buyurtma yo'q</div>}
            {recent.map((o) => {
              const uz = statusEnToUz(o.status);
              return (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderTop: '1px solid #f2f2f7' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{o.orderNumber}</div>
                    <div style={{ fontSize: '12.5px', color: '#9ca3af' }}>{o.customerName}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{formatSom(o.total)}</div>
                  <span style={badgeStyle(uz)}>{statusMeta(uz).label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
