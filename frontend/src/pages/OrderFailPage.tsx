import { useNavigate } from 'react-router-dom';

export function OrderFailPage() {
  const nav = useNavigate();

  return (
    <main style={{ maxWidth: '620px', margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '20px', padding: '44px 36px', textAlign: 'center' }}>
        <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#fee2e2', display: 'grid', placeItems: 'center', margin: '0 auto 22px' }}>
          <span style={{ fontSize: '44px', color: '#ef4444' }}>✕</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 8px' }}>To'lov amalga oshmadi</h1>
        <p style={{ color: '#6b7280', margin: '0 0 24px', lineHeight: 1.5 }}>Karta ma'lumotlarida xatolik yoki mablag' yetarli emas. Iltimos, qayta urinib ko'ring.</p>
        <div className="mp-stack" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => nav('/checkout')} className="hbg-primary" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Qayta urinish</button>
          <button onClick={() => nav('/')} style={{ background: '#f2f2f7', color: '#374151', border: 'none', padding: '14px 28px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Bosh sahifa</button>
        </div>
      </div>
    </main>
  );
}
