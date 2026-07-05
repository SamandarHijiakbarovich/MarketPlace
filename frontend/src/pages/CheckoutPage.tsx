import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateOrderPayload, PaymentMethod as ApiPayMethod } from '../types/order';
import type { DeliveryMethod as ApiDeliveryMethod } from '../types/delivery';
import type { PayMethod, ShipMethod } from '../types/shop';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api/orders';
import { toOrder } from '../lib/mappers';
import { deliveryCost, etaText, formatSom } from '../lib/format';

const labelStyle: CSSProperties = { display: 'block', fontSize: '13.5px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 };
const inp = (bad: boolean): CSSProperties => ({ width: '100%', padding: '12px 14px', border: '1px solid ' + (bad ? '#ef4444' : '#e5e7eb'), borderRadius: '10px', outline: 'none', fontSize: '14.5px' });
const errText: CSSProperties = { color: '#ef4444', fontSize: '12.5px', marginTop: '5px', display: 'block' };

export function CheckoutPage() {
  const nav = useNavigate();
  const { cart, clear, loading: cartLoading } = useCart();
  const { setLastOrder } = useData();
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [address, setAddress] = useState('');
  const [shipMethod, setShipMethod] = useState<ShipMethod>('standard');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [cardNum, setCardNum] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const placed = useRef(false); // buyurtma berilgach savat bo'shaydi — /cart'ga qaytarmaslik uchun

  const items = cart?.items ?? [];

  // Savat YUKLANIB BO'LGACH bo'sh bo'lsa — savat sahifasiga qaytaramiz.
  // (yuklanish paytida yoki buyurtma muvaffaqiyatli berilgach qaytarib yubormaymiz)
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !placed.current) nav('/cart');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartLoading, items.length]);

  const subtotal = cart?.total ?? 0;
  const delivery = deliveryCost(shipMethod);
  const total = subtotal + delivery;

  const validName = name.trim().length >= 2;
  const validPhone = phone.replace(/\D/g, '').length >= 9;
  const validAddr = address.trim().length >= 5;
  const validCard = payMethod !== 'card' || cardNum.replace(/\s/g, '').length === 16;

  const onCard = (v: string) => {
    const formatted = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    setCardNum(formatted);
  };

  const placeOrder = async () => {
    if (!(validName && validPhone && validAddr && validCard)) {
      setShowErrors(true);
      return;
    }
    if (!cart) return;

    const payload: CreateOrderPayload = {
      cartId: cart.cartId,
      deliveryAddress: { fullName: name, phone, address },
      deliveryMethod: (shipMethod === 'express' ? 'Express' : 'Standard') as ApiDeliveryMethod,
      paymentMethod: (payMethod === 'card' ? 'Card' : 'CashOnDelivery') as ApiPayMethod,
      cardNumber: payMethod === 'card' ? cardNum : undefined,
    };

    try {
      setSubmitting(true);
      const order = await ordersApi.checkout(payload);
      placed.current = true; // redirect effekti /cart'ga yubormasin
      setLastOrder(toOrder(order)); // muvaffaqiyat sahifasi uchun
      clear(); // backend savatni bo'shatdi — lokal holatni ham tozalaymiz
      nav('/order-success');
    } catch (e) {
      // Backend to'lovni rad etsa (masalan "4000..." karta) yoki boshqa xato -> xato sahifasi
      console.warn('Checkout xatosi:', e);
      nav('/order-fail');
    } finally {
      setSubmitting(false);
    }
  };

  const shipMethods: { key: ShipMethod; title: string; sub: string; cost: number }[] = [
    { key: 'standard', title: 'Standart yetkazish', sub: '3 ish kuni ichida', cost: 25000 },
    { key: 'express', title: 'Tezkor yetkazish', sub: 'Ertaga (1 kun)', cost: 50000 },
  ];
  const payMethods: { key: PayMethod; title: string; icon: string }[] = [
    { key: 'card', title: 'Karta', icon: '💳' },
    { key: 'cash', title: 'Naqd (yetkazganda)', icon: '💵' },
  ];

  return (
    <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 20px 64px' }}>
      <button onClick={() => nav('/cart')} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '14px', fontSize: '14.5px' }}>← Savatga qaytish</button>
      <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Buyurtmani rasmiylashtirish</h1>

      <div className="mp-stack" style={{ display: 'flex', gap: '26px', alignItems: 'flex-start' }}>
        <div className="mp-full-sm" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Manzil */}
          <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 16px' }}>1. Yetkazib berish manzili</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>To'liq ism</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism Familiya" style={inp(showErrors && !validName)} />
                {showErrors && !validName && <span style={errText}>Ismni kiriting</span>}
              </div>
              <div>
                <label style={labelStyle}>Telefon raqam</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" style={inp(showErrors && !validPhone)} />
                {showErrors && !validPhone && <span style={errText}>To'g'ri telefon raqam kiriting</span>}
              </div>
              <div>
                <label style={labelStyle}>Manzil</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shahar, ko'cha, uy" style={inp(showErrors && !validAddr)} />
                {showErrors && !validAddr && <span style={errText}>Manzilni kiriting</span>}
              </div>
            </div>
          </div>

          {/* Yetkazish usuli */}
          <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 16px' }}>2. Yetkazib berish usuli</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shipMethods.map((m) => {
                const active = shipMethod === m.key;
                return (
                  <button key={m.key} onClick={() => setShipMethod(m.key)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px', borderRadius: '12px', cursor: 'pointer', border: active ? '2px solid #4F46E5' : '1px solid #e5e7eb', background: active ? '#f5f4ff' : '#fff' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, border: active ? '5px solid #4F46E5' : '2px solid #cbd0dc' }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ fontWeight: 700, display: 'block' }}>{m.title}</span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{m.sub}</span>
                    </span>
                    <span style={{ fontWeight: 700 }}>{formatSom(m.cost)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* To'lov usuli */}
          <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 16px' }}>3. To'lov usuli</h3>
            <div className="mp-stack" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {payMethods.map((m) => {
                const active = payMethod === m.key;
                return (
                  <button key={m.key} onClick={() => setPayMethod(m.key)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', borderRadius: '12px', cursor: 'pointer', border: active ? '2px solid #4F46E5' : '1px solid #e5e7eb', background: active ? '#f5f4ff' : '#fff' }}>
                    <span style={{ fontSize: '22px' }}>{m.icon}</span>
                    <span style={{ fontWeight: 700 }}>{m.title}</span>
                  </button>
                );
              })}
            </div>
            {payMethod === 'card' && (
              <div style={{ borderTop: '1px solid #f0f0f6', paddingTop: '16px' }}>
                <label style={labelStyle}>Karta raqami (test)</label>
                <input value={cardNum} onChange={(e) => onCard(e.target.value)} placeholder="0000 0000 0000 0000" maxLength={19} style={inp(showErrors && !validCard)} />
                {showErrors && !validCard && <span style={errText}>16 xonali karta raqamini kiriting</span>}
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 0' }}>Test: "4000..." bilan boshlansa — to'lov rad etiladi.</p>
              </div>
            )}
          </div>
        </div>

        {/* Xulosa */}
        <div className="mp-full-sm" style={{ width: '350px', flexShrink: 0, background: '#fff', border: '1px solid #ececf3', borderRadius: '18px', padding: '22px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Buyurtma</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '220px', overflow: 'auto' }}>
            {items.map((it) => (
              <div key={it.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ backgroundImage: `url('${it.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', width: '44px', height: '44px', borderRadius: '9px', flexShrink: 0, background: it.imageUrl ? undefined : '#eef2ff' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.productName}</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7280' }}>{it.quantity} × {formatSom(it.unitPrice)}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{formatSom(it.subtotal)}</div>
              </div>
            ))}
          </div>
          <div style={{ height: '1px', background: '#f0f0f6', margin: '8px 0 16px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#6b7280', fontSize: '14.5px' }}><span>Mahsulotlar</span><span style={{ color: '#111827', fontWeight: 600 }}>{formatSom(subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#6b7280', fontSize: '14.5px' }}><span>Yetkazib berish</span><span style={{ color: '#111827', fontWeight: 600 }}>{formatSom(delivery)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#6b7280', fontSize: '13.5px' }}><span>Taxminiy sana</span><span style={{ color: '#4F46E5', fontWeight: 600 }}>{etaText(shipMethod)}</span></div>
          <div style={{ height: '1px', background: '#f0f0f6', margin: '4px 0 16px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: 800 }}><span>Yakuniy</span><span>{formatSom(total)}</span></div>
          <button onClick={placeOrder} disabled={submitting} className="hbg-primary" style={{ width: '100%', background: '#4F46E5', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, fontSize: '15.5px', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Yuborilmoqda...' : `To'lash va buyurtma berish · ${formatSom(total)}`}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', margin: '12px 0 0' }}>🔒 To'lov ma'lumotlaringiz himoyalangan</p>
        </div>
      </div>
    </main>
  );
}
