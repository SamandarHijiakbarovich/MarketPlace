import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { CreateOrderPayload } from '../types/order';
import { ordersApi } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { toOrder } from '../lib/mappers';
import { formatSom } from '../lib/format';

// Provayder brend ranglari (haqiqiy Click/Payme uslubiga yaqin)
const BRAND: Record<string, { name: string; color: string; grad: string }> = {
  click: { name: 'Click', color: '#0098EB', grad: 'linear-gradient(135deg, #0098EB 0%, #23B0FF 100%)' },
  payme: { name: 'Payme', color: '#00C2CB', grad: 'linear-gradient(135deg, #00C2CB 0%, #33D9D0 100%)' },
};

interface GatewayState {
  payload: CreateOrderPayload;
  amount: number;
}

/**
 * Click/Payme to'lov sahifasi imitatsiyasi (test/sandbox rejimi).
 * Haqiqiy integratsiyada foydalanuvchi provayderning (my.click.uz / checkout.paycom.uz)
 * sahifasiga redirect qilinardi va to'lovdan so'ng callback orqali buyurtma tasdiqlanardi.
 * Bu yerda o'sha oqimni namoyish qilamiz: tasdiqlash -> buyurtma yaratish -> muvaffaqiyat.
 */
export function PaymentGatewayPage() {
  const nav = useNavigate();
  const { provider } = useParams<{ provider: string }>();
  const { state } = useLocation() as { state?: GatewayState };
  const { clear } = useCart();
  const { setLastOrder } = useData();
  const [processing, setProcessing] = useState(false);

  const brand = BRAND[provider ?? ''] ?? BRAND.click;

  // Ma'lumotsiz to'g'ridan kirilса (masalan URL orqali) — savatga qaytaramiz
  useEffect(() => {
    if (!state?.payload) nav('/cart', { replace: true });
  }, [state, nav]);

  if (!state?.payload) return null;

  const pay = async () => {
    setProcessing(true);
    try {
      const order = await ordersApi.checkout(state.payload);
      setLastOrder(toOrder(order));
      clear(); // backend savatni bo'shatdi
      nav('/order-success', { replace: true });
    } catch (e) {
      console.warn('Gateway to\'lov xatosi:', e);
      nav('/order-fail', { replace: true });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: brand.grad, display: 'grid', placeItems: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '32px 28px', boxShadow: '0 30px 60px rgba(0,0,0,0.25)', textAlign: 'center' }}>
        {/* Provayder logotipi (matnli) */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: brand.color, color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.01em', marginBottom: '6px' }}>
          {brand.name}
        </div>
        <div style={{ display: 'inline-block', marginLeft: '8px', background: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', verticalAlign: 'middle' }}>TEST</div>

        <p style={{ color: '#6b7280', fontSize: '14px', margin: '18px 0 4px' }}>To'lov qabul qiluvchi</p>
        <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>MarketPlace — Elektronika do'koni</div>

        <div style={{ background: '#f7f7fb', borderRadius: '14px', padding: '20px', marginBottom: '22px' }}>
          <div style={{ color: '#6b7280', fontSize: '13.5px', marginBottom: '4px' }}>To'lov summasi</div>
          <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>{formatSom(state.amount)}</div>
        </div>

        <button
          onClick={pay}
          disabled={processing}
          style={{ width: '100%', background: brand.color, color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, fontSize: '15.5px', cursor: processing ? 'wait' : 'pointer', opacity: processing ? 0.7 : 1, marginBottom: '10px' }}
        >
          {processing ? 'To\'lov amalga oshirilmoqda...' : `${brand.name} orqali to'lash`}
        </button>
        <button
          onClick={() => nav('/checkout', { replace: true })}
          disabled={processing}
          style={{ width: '100%', background: 'none', color: '#6b7280', border: 'none', padding: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          Bekor qilish
        </button>

        <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '16px 0 0', lineHeight: 1.5 }}>
          🔒 Bu — {brand.name} test (sandbox) sahifasi. Haqiqiy integratsiyada {brand.name}ning
          rasmiy to'lov sahifasiga yo'naltirilardi.
        </p>
      </div>
    </div>
  );
}
