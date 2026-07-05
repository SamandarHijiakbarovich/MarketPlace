import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const nav = useNavigate();
  const { adminLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  // Allaqachon kirgan bo'lsa — to'g'ridan dashboardga
  useEffect(() => {
    if (isAuthenticated) nav('/admin/dashboard');
  }, [isAuthenticated, nav]);

  const submit = async () => {
    setErr(false);
    const ok = await adminLogin(email, pass);
    if (ok) {
      nav('/admin/dashboard');
    } else {
      setErr(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4F46E5 0%, #7C6FF0 100%)', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 36px', width: '100%', maxWidth: '400px', boxShadow: '0 30px 60px rgba(30,20,80,0.28)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '8px' }}>
          <span style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#4F46E5', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '20px' }}>M</span>
          <span style={{ fontWeight: 800, fontSize: '20px' }}>MarketPlace</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '18px 0 4px' }}>Admin panelga kirish</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>Boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13.5px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@marketplace.uz" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14.5px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13.5px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 }}>Parol</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && submit()} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14.5px' }} />
          </div>
          {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 12px', borderRadius: '9px', fontSize: '13.5px' }}>Email yoki parol noto'g'ri</div>}
          <button onClick={submit} className="hbg-primary" style={{ width: '100%', background: '#4F46E5', color: '#fff', border: 'none', padding: '13px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '4px' }}>Kirish</button>
          <div style={{ background: '#f7f7fb', borderRadius: '9px', padding: '10px 12px', fontSize: '12.5px', color: '#6b7280', textAlign: 'center' }}>Demo: admin@marketplace.uz / Admin123!</div>
          <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 600, cursor: 'pointer', fontSize: '13.5px' }}>← Do'konga qaytish</button>
        </div>
      </div>
    </div>
  );
}
