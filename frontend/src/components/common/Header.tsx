import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import { initials } from '../../lib/format';

export function Header() {
  const nav = useNavigate();
  const location = useLocation();
  const { count } = useCart();
  const { currentUser, openLogin, logoutBuyer } = useAuth();
  const { search, setSearch } = useSearch();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  // Qidiruvni faqat bosh sahifada tahrirlaymiz — boshqa sahifada yozilsa bosh sahifaga o'tkazamiz
  const onSearch = (v: string) => {
    setSearch(v);
    if (location.pathname !== '/') nav('/');
  };

  const goHome = () => {
    setMobileMenu(false);
    nav('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: '1px solid #ececf3',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <button
          onClick={goHome}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#4F46E5', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '18px' }}>M</span>
          <span style={{ fontWeight: 800, fontSize: '19px', letterSpacing: '-0.02em', color: '#111827' }}>MarketPlace</span>
        </button>

        <div className="mp-hide-sm" style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>⌕</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Mahsulot qidirish — smartfon, noutbuk..."
            style={{ width: '100%', padding: '11px 14px 11px 36px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fafafc', fontSize: '14.5px', outline: 'none' }}
          />
        </div>

        <div style={{ flex: 1 }} className="mp-only-sm" />

        <button onClick={goHome} className="mp-hide-sm htx-primary" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14.5px', fontWeight: 600, color: '#374151', padding: '8px' }}>Katalog</button>
        <button onClick={() => nav('/admin/login')} className="mp-hide-sm htx-primary" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14.5px', fontWeight: 600, color: '#374151', padding: '8px' }}>Admin</button>

        <div style={{ position: 'relative' }}>
          {!currentUser ? (
            <button onClick={openLogin} className="hbg-soft" style={{ background: '#eef0ff', color: '#4F46E5', border: '1px solid #dcdcfb', borderRadius: '11px', padding: '10px 16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Kirish</button>
          ) : (
            <>
              <button onClick={() => setUserMenu((v) => !v)} className="hbg-soft" style={{ display: 'flex', alignItems: 'center', gap: '9px', background: '#f2f2f7', border: '1px solid #ececf3', borderRadius: '11px', padding: '6px 12px 6px 6px', cursor: 'pointer' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#4F46E5', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '13px' }}>{initials(currentUser.name)}</span>
                <span className="mp-hide-sm" style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{currentUser.name}</span>
              </button>
              {userMenu && (
                <div style={{ position: 'absolute', right: 0, top: '52px', width: '224px', background: '#fff', border: '1px solid #ececf3', borderRadius: '14px', boxShadow: '0 16px 40px rgba(20,15,50,0.16)', padding: '8px', zIndex: 60 }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #f2f2f7', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '12.5px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                  </div>
                  <button onClick={() => { setUserMenu(false); nav('/cart'); }} className="hbg-lite" style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '9px', fontWeight: 600, fontSize: '14px', color: '#374151', cursor: 'pointer' }}>Savatim</button>
                  <button onClick={() => { setUserMenu(false); logoutBuyer(); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', borderRadius: '9px', fontWeight: 600, fontSize: '14px', color: '#dc2626', cursor: 'pointer' }}>Chiqish</button>
                </div>
              )}
            </>
          )}
        </div>

        <button onClick={() => nav('/cart')} className="hbg-soft" style={{ position: 'relative', background: '#f2f2f7', border: '1px solid #ececf3', width: '42px', height: '42px', borderRadius: '11px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '19px', color: '#374151' }}>
          <span>🛒</span>
          {count > 0 && (
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#4F46E5', color: '#fff', fontSize: '11px', fontWeight: 700, minWidth: '19px', height: '19px', borderRadius: '20px', display: 'grid', placeItems: 'center', padding: '0 5px' }}>{count}</span>
          )}
        </button>

        <button onClick={() => setMobileMenu((v) => !v)} className="mp-only-sm" style={{ background: '#f2f2f7', border: '1px solid #ececf3', width: '42px', height: '42px', borderRadius: '11px', cursor: 'pointer', fontSize: '18px' }}>☰</button>
      </div>

      {mobileMenu && (
        <div className="mp-only-sm" style={{ padding: '4px 20px 16px', borderTop: '1px solid #f0f0f6' }}>
          <div style={{ position: 'relative', margin: '12px 0' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>⌕</span>
            <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Qidirish..." style={{ width: '100%', padding: '11px 14px 11px 36px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fafafc', outline: 'none' }} />
          </div>
          {!currentUser ? (
            <button onClick={() => { setMobileMenu(false); openLogin(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px', background: 'none', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>Kirish / Ro'yxatdan o'tish</button>
          ) : (
            <button onClick={() => { setMobileMenu(false); logoutBuyer(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px', background: 'none', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}>Chiqish ({currentUser.name})</button>
          )}
          <button onClick={() => { setMobileMenu(false); nav('/admin/login'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px', background: 'none', border: 'none', borderRadius: '8px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Admin panel →</button>
        </div>
      )}
    </header>
  );
}
