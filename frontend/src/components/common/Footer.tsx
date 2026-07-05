export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #ececf3', background: '#fff', marginTop: '40px' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '30px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          color: '#9ca3af',
          fontSize: '13.5px',
        }}
      >
        <span>© 2026 MarketPlace — Elektronika do'koni</span>
        <span>Rasmiy kafolat · Tez yetkazib berish · 24/7 qo'llab-quvvatlash</span>
      </div>
    </footer>
  );
}
