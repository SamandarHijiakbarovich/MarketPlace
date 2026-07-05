import { useEffect, useState } from 'react';
import { useAuth, type AuthForm } from '../../context/AuthContext';

const EMPTY: AuthForm = { name: '', email: '', phone: '', pass: '', pass2: '' };

const labelStyle = { display: 'block', fontSize: '13.5px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 } as const;
const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14.5px' } as const;

export function AuthModal() {
  const { authModal, switchAuth, closeAuth, loginBuyer, registerBuyer } = useAuth();
  const [form, setForm] = useState<AuthForm>(EMPTY);
  const [err, setErr] = useState<string | null>(null);

  const isRegister = authModal === 'register';

  // Modal ochilganda formani tozalaymiz
  useEffect(() => {
    if (authModal) {
      setForm(EMPTY);
      setErr(null);
    }
  }, [authModal]);

  if (!authModal) return null;

  const set = (k: keyof AuthForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    const result = isRegister ? registerBuyer(form) : loginBuyer(form);
    setErr(result); // null bo'lsa muvaffaqiyat (modal AuthContext ichida yopiladi)
  };

  const tabStyle = (active: boolean) =>
    ({
      flex: 1,
      padding: '11px',
      borderRadius: '10px',
      border: 'none',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer',
      background: active ? '#fff' : 'transparent',
      color: active ? '#111827' : '#9ca3af',
      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
    }) as const;

  return (
    <div onClick={closeAuth} style={{ position: 'fixed', inset: 0, background: 'rgba(15,12,40,0.5)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'grid', placeItems: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '420px', maxHeight: '92vh', overflow: 'auto', padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#4F46E5', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>M</span>
            <span style={{ fontWeight: 800, fontSize: '18px' }}>{isRegister ? "Ro'yxatdan o'tish" : 'Hisobga kirish'}</span>
          </div>
          <button onClick={closeAuth} style={{ background: '#f2f2f7', border: 'none', width: '34px', height: '34px', borderRadius: '9px', fontSize: '17px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#f2f2f7', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
          <button onClick={() => switchAuth('login')} style={tabStyle(!isRegister)}>Kirish</button>
          <button onClick={() => switchAuth('register')} style={tabStyle(isRegister)}>Ro'yxatdan o'tish</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={labelStyle}>To'liq ism</label>
              <input value={form.name} onChange={set('name')} placeholder="Ism Familiya" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input value={form.email} onChange={set('email')} placeholder="email@mail.uz" style={inputStyle} />
          </div>
          {isRegister && (
            <div>
              <label style={labelStyle}>Telefon</label>
              <input value={form.phone} onChange={set('phone')} placeholder="+998 90 123 45 67" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Parol</label>
            <input type="password" value={form.pass} onChange={set('pass')} placeholder="••••••••" style={inputStyle} />
          </div>
          {isRegister && (
            <div>
              <label style={labelStyle}>Parolni tasdiqlang</label>
              <input type="password" value={form.pass2} onChange={set('pass2')} placeholder="••••••••" style={inputStyle} />
            </div>
          )}
          {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 12px', borderRadius: '9px', fontSize: '13.5px' }}>{err}</div>}
          <button onClick={submit} className="hbg-primary" style={{ width: '100%', background: '#4F46E5', color: '#fff', border: 'none', padding: '14px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '2px' }}>
            {isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
          </button>
          {!isRegister && (
            <div style={{ background: '#f7f7fb', borderRadius: '9px', padding: '10px 12px', fontSize: '12.5px', color: '#6b7280', textAlign: 'center' }}>Demo hisob: user@mail.uz / 12345</div>
          )}
        </div>
      </div>
    </div>
  );
}
