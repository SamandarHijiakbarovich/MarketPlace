import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatSom } from '../lib/format';

export function OrderSuccessPage() {
  const nav = useNavigate();
  const { lastOrder } = useData();

  // To'g'ridan-to'g'ri kirilsa (buyurtmasiz) — bosh sahifaga
  useEffect(() => {
    if (!lastOrder) nav('/');
  }, [lastOrder, nav]);

  if (!lastOrder) return null;

  const row = (label: string, value: string, bold = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ececf3' }}>
      <span style={{ color: '#6b7280' }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 700, color: bold ? '#4F46E5' : '#111827' }}>{value}</span>
    </div>
  );

  return (
    <main style={{ maxWidth: '620px', margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '20px', padding: '44px 36px', textAlign: 'center' }}>
        <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#dcfce7', display: 'grid', placeItems: 'center', margin: '0 auto 22px' }}>
          <span style={{ fontSize: '44px', color: '#16a34a' }}>✓</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 8px' }}>Buyurtma qabul qilindi!</h1>
        <p style={{ color: '#6b7280', margin: '0 0 22px', lineHeight: 1.5 }}>Rahmat! Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada operator siz bilan bog'lanadi.</p>
        <div style={{ background: '#f7f7fb', borderRadius: '14px', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
          {row('Buyurtma raqami', lastOrder.id, true)}
          {row('Yakuniy summa', formatSom(lastOrder.total))}
          {row("To'lov usuli", lastOrder.pay)}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#6b7280' }}>Taxminiy yetkazish</span>
            <span style={{ fontWeight: 700 }}>{lastOrder.eta ?? '—'}</span>
          </div>
        </div>
        <button onClick={() => nav('/')} className="hbg-primary" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Xaridni davom ettirish</button>
      </div>
    </main>
  );
}
