import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../types/shop';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { formatSom } from '../lib/format';
import { categoryMeta, imageStyle, thumbBg } from '../lib/ui';

export function ProductDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { getProductDetail } = useData();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Mahsulot tafsilotini backend'dan olamiz (tavsif bilan)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setQty(1);
    window.scrollTo(0, 0);
    getProductDetail(Number(id))
      .then((prod) => { if (alive) { setP(prod); setNotFound(false); } })
      .catch(() => { if (alive) setNotFound(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>Yuklanmoqda...</main>;
  }

  if (notFound || !p) {
    return (
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Mahsulot topilmadi</h2>
        <button onClick={() => nav('/')} className="hbg-primary" style={{ marginTop: '16px', background: '#4F46E5', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Bosh sahifa</button>
      </main>
    );
  }

  const out = p.stock <= 0;
  const disc = p.oldPrice != null && p.oldPrice > p.price;
  const c = categoryMeta(p.cat);
  const stockLabel = out ? '● Omborda tugagan' : p.stock <= 5 ? `● Kam qoldi — ${p.stock} dona` : '● Mavjud — omborda bor';
  const specs = p.specs ?? [];

  return (
    <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 20px 64px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '14px' }}>Bosh sahifa</button>
        <span>/</span><span>{p.categoryName ?? c.label}</span><span>/</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>{p.name}</span>
      </div>

      <div className="mp-stack" style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>
        {/* Galereya */}
        <div className="mp-full-sm" style={{ flex: 1, minWidth: 0, maxWidth: '560px', position: 'sticky', top: '90px' }}>
          <div style={{ ...imageStyle(p), border: '1px solid #ececf3', borderRadius: '18px', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {!p.img && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#9ca3af' }}>{p.name} — asosiy rasm</span>}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ background: thumbBg(p.cat), border: '1px solid #ececf3', borderRadius: '12px', height: '76px', flex: 1, ...(i === 0 ? { outline: '2px solid #4F46E5', outlineOffset: '1px' } : {}) }} />
            ))}
          </div>
        </div>

        {/* Ma'lumot */}
        <div className="mp-full-sm" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '12.5px', color: '#8b8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.categoryName ?? c.label}</span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 12px', lineHeight: 1.15 }}>{p.name}</h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>{formatSom(p.price)}</span>
            {disc && <span style={{ fontSize: '17px', color: '#b0b3c0', textDecoration: 'line-through' }}>{formatSom(p.oldPrice!)}</span>}
          </div>

          <div style={{ display: 'inline-block', padding: '7px 14px', borderRadius: '9px', fontSize: '13.5px', fontWeight: 600, background: out ? '#fef2f2' : '#f0fdf4', color: out ? '#dc2626' : '#16a34a' }}>{stockLabel}</div>

          <p style={{ color: '#4b5563', lineHeight: 1.65, fontSize: '15px', margin: '20px 0 24px' }}>{p.desc}</p>

          {/* Miqdor + savat */}
          <div className="mp-stack" style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '11px', overflow: 'hidden' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="hbg-cell" style={{ width: '46px', height: '48px', background: '#fafafc', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#374151' }}>−</button>
              <span style={{ width: '54px', textAlign: 'center', fontWeight: 700, fontSize: '16px' }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(q + 1, Math.max(1, p.stock)))} className="hbg-cell" style={{ width: '46px', height: '48px', background: '#fafafc', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#374151' }}>+</button>
            </div>
            <button
              onClick={() => addToCart(p.id, qty)}
              disabled={out}
              className={out ? undefined : 'hbg-primary'}
              style={
                out
                  ? { flex: 1, padding: '15px 22px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', background: '#f2f2f7', color: '#b0b3c0', cursor: 'not-allowed' }
                  : { flex: 1, padding: '15px 22px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', background: '#4F46E5', color: '#fff', cursor: 'pointer' }
              }
            >
              {out ? 'Omborda tugagan' : `Savatga qo'shish — ${formatSom(p.price * qty)}`}
            </button>
          </div>

          {/* Texnik xususiyatlar — faqat bo'lsa ko'rsatiladi */}
          {specs.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '6px 22px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '18px 0 10px' }}>Texnik xususiyatlar</h3>
              {specs.map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderTop: '1px solid #f2f2f7', fontSize: '14.5px' }}>
                  <span style={{ color: '#6b7280' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#111827', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
