import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '▤', path: '/admin/dashboard' },
  { key: 'products', label: 'Mahsulotlar', icon: '▦', path: '/admin/products' },
  { key: 'orders', label: 'Buyurtmalar', icon: '▧', path: '/admin/orders' },
];

const TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Mahsulotlar',
  '/admin/orders': 'Buyurtmalar',
};

export function AdminLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sideOpen, setSideOpen] = useState(false);

  const go = (path: string) => {
    setSideOpen(false);
    nav(path);
  };

  const adminLogout = () => {
    logout();
    nav('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7FB' }}>
      {/* Sidebar */}
      <aside className={`mp-admin-side ${sideOpen ? 'open' : ''}`} style={{ position: 'fixed', left: 0, top: 0, width: '250px', height: '100vh', background: '#14132b', color: '#cfcdec', padding: '22px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '6px 8px 22px' }}>
          <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4F46E5', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '18px' }}>M</span>
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#fff' }}>MarketPlace</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map((n) => {
            const active = location.pathname === n.path;
            return (
              <button key={n.key} onClick={() => go(n.path)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14.5px', cursor: 'pointer', textAlign: 'left', background: active ? '#4F46E5' : 'transparent', color: active ? '#fff' : '#a9a7c8' }}>
                <span style={{ fontSize: '18px' }}>{n.icon}</span>
                {n.label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={adminLogout} className="hbg-side" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'none', border: 'none', color: '#f0a0a0', fontWeight: 600, fontSize: '14.5px', cursor: 'pointer', borderRadius: '10px', textAlign: 'left' }}>
            <span style={{ fontSize: '18px' }}>⏻</span> Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="mp-admin-main" style={{ marginLeft: '250px' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #ececf3', padding: '14px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSideOpen((v) => !v)} className="mp-only-sm" style={{ background: '#f2f2f7', border: 'none', width: '40px', height: '40px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer' }}>☰</button>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{TITLES[location.pathname] ?? 'Admin'}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="mp-hide-sm" style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Sardor Aliyev</div>
              <div style={{ fontSize: '12.5px', color: '#9ca3af' }}>Administrator</div>
            </div>
            <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4F46E5', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>SA</span>
          </div>
        </header>

        <div style={{ padding: '26px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
