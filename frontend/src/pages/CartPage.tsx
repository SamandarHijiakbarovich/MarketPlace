import { useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useCart } from '../context/CartContext';
import { formatSom } from '../lib/format';

// Savat mahsuloti rasmi (backend imageUrl beradi)
function thumb(imageUrl: string, size: number): CSSProperties {
  return {
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    background: imageUrl ? undefined : '#eef2ff',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '12px',
    flexShrink: 0,
  };
}

export function CartPage() {
  const nav = useNavigate();
  const { cart, count, changeQty, removeFromCart } = useCart();

  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;

  return (
    <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 64px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Savat</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #ececf3', borderRadius: '18px' }}>
          <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: '#f2f2f7', display: 'grid', placeItems: 'center', fontSize: '42px', margin: '0 auto 20px' }}>🛒</div>
          <h3 style={{ fontSize: '21px', fontWeight: 700, margin: '0 0 8px' }}>Savatingiz bo'sh</h3>
          <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Katalogdan yoqqan mahsulotlaringizni shu yerga qo'shing.</p>
          <button onClick={() => nav('/')} className="hbg-primary" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '13px 26px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Xaridni davom ettirish</button>
        </div>
      ) : (
        <div className="mp-stack" style={{ display: 'flex', gap: '26px', alignItems: 'flex-start' }}>
          <div className="mp-full-sm" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map((it) => (
              <div key={it.productId} style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div onClick={() => nav(`/products/${it.productId}`)} style={{ ...thumb(it.imageUrl, 82), cursor: 'pointer' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 onClick={() => nav(`/products/${it.productId}`)} style={{ fontSize: '15.5px', fontWeight: 600, margin: '0 0 6px', cursor: 'pointer' }}>{it.productName}</h3>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{formatSom(it.unitPrice)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <button onClick={() => changeQty(it.productId, -1)} className="hbg-cell" style={{ width: '38px', height: '40px', background: '#fafafc', border: 'none', fontSize: '18px', cursor: 'pointer' }}>−</button>
                  <span style={{ width: '42px', textAlign: 'center', fontWeight: 700 }}>{it.quantity}</span>
                  <button onClick={() => changeQty(it.productId, 1)} className="hbg-cell" style={{ width: '38px', height: '40px', background: '#fafafc', border: 'none', fontSize: '18px', cursor: 'pointer' }}>+</button>
                </div>
                <div className="mp-hide-sm" style={{ width: '120px', textAlign: 'right', fontWeight: 800, fontSize: '15.5px', flexShrink: 0 }}>{formatSom(it.subtotal)}</div>
                <button onClick={() => removeFromCart(it.productId)} className="htx-danger" style={{ background: 'none', border: 'none', color: '#b0b3c0', cursor: 'pointer', fontSize: '20px', padding: '6px', flexShrink: 0 }}>🗑</button>
              </div>
            ))}
          </div>

          {/* Xulosa */}
          <div className="mp-full-sm" style={{ width: '340px', flexShrink: 0, background: '#fff', border: '1px solid #ececf3', borderRadius: '18px', padding: '22px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 18px' }}>Buyurtma xulosasi</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#6b7280', fontSize: '14.5px' }}><span>Mahsulotlar ({count})</span><span style={{ color: '#111827', fontWeight: 600 }}>{formatSom(subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#6b7280', fontSize: '14.5px' }}><span>Yetkazib berish</span><span style={{ color: '#16a34a', fontWeight: 600 }}>Keyingi bosqichda</span></div>
            <div style={{ height: '1px', background: '#f0f0f6', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 800 }}><span>Jami</span><span>{formatSom(subtotal)}</span></div>
            <button onClick={() => nav('/checkout')} className="hbg-primary" style={{ width: '100%', background: '#4F46E5', color: '#fff', border: 'none', padding: '14px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Buyurtma berish →</button>
            <button onClick={() => nav('/')} style={{ width: '100%', background: 'none', color: '#4F46E5', border: 'none', padding: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>Xaridni davom ettirish</button>
          </div>
        </div>
      )}
    </main>
  );
}
