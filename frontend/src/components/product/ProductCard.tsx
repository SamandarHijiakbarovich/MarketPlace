import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/shop';
import { useCart } from '../../context/CartContext';
import { formatSom } from '../../lib/format';
import { categoryMeta, imageStyle } from '../../lib/ui';

export function ProductCard({ p }: { p: Product }) {
  const nav = useNavigate();
  const { addToCart } = useCart();

  const out = p.stock <= 0;
  const disc = p.oldPrice != null && p.oldPrice > p.price;
  const discountPct = disc ? Math.round((1 - p.price / p.oldPrice!) * 100) : 0;
  const stockLabel = out ? 'Tugagan' : p.stock <= 5 ? `${p.stock} dona qoldi` : 'Mavjud';

  const open = () => nav(`/products/${p.id}`);

  return (
    <div className="prodcard" style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div onClick={open} style={{ cursor: 'pointer', position: 'relative' }}>
        <div style={{ ...imageStyle(p), height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', textAlign: 'center' }}>
          {!p.img && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: '#9ca3af', letterSpacing: '0.02em' }}>{p.name} — rasm</span>}
        </div>
        {disc && (
          <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 9px', borderRadius: '7px' }}>-{discountPct}%</span>
        )}
        {out && (
          <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#4b5563', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 9px', borderRadius: '7px' }}>Tugagan</span>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '12px', color: '#8b8fa3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{categoryMeta(p.cat).label}</span>
        <h3 onClick={open} style={{ fontSize: '15.5px', fontWeight: 600, margin: '6px 0 4px', lineHeight: 1.35, cursor: 'pointer', color: '#111827' }}>{p.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px', color: '#9ca3af', fontSize: '13px' }}>
          {p.rating != null && <><span style={{ color: '#f59e0b' }}>★</span> {p.rating} · </>}{stockLabel}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>{formatSom(p.price)}</span>
          {disc && <span style={{ fontSize: '13px', color: '#b0b3c0', textDecoration: 'line-through' }}>{formatSom(p.oldPrice!)}</span>}
        </div>
        <button
          onClick={() => addToCart(p.id)}
          disabled={out}
          className={out ? undefined : 'hbg-primary'}
          style={
            out
              ? { width: '100%', padding: '11px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px', background: '#f2f2f7', color: '#b0b3c0', cursor: 'not-allowed' }
              : { width: '100%', padding: '11px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px', background: '#4F46E5', color: '#fff', cursor: 'pointer' }
          }
        >
          {out ? 'Tugagan' : "Savatga qo'shish"}
        </button>
      </div>
    </div>
  );
}
