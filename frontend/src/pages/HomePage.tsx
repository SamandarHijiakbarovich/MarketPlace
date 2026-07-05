import { useMemo } from 'react';
import type { Product } from '../types/shop';
import { useData } from '../context/DataContext';
import { useSearch, type CategoryFilter } from '../context/SearchContext';
import { ProductCard } from '../components/product/ProductCard';
import { CATS } from '../lib/ui';

const PAGE_SIZE = 8;

const CHIPS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'Barchasi' },
  ...(Object.keys(CATS) as (keyof typeof CATS)[]).map((k) => ({ key: k as CategoryFilter, label: CATS[k].label })),
];

export function HomePage() {
  const { products, loading } = useData();
  const { search, category, setCategory, sort, setSort, page, setPage, clearFilters } = useSearch();

  // Filtr + qidiruv + saralash
  const filtered = useMemo(() => {
    let list = products.filter((p) => category === 'all' || p.cat === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || CATS[p.cat].label.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, category, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts: Product[] = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goPage = (n: number) => { setPage(n); top(); };

  const scrollToGrid = () => {
    const el = document.getElementById('mp-grid');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 64px' }}>
      {/* HERO */}
      <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(120deg, #4F46E5 0%, #6D5AE6 55%, #8B7BF0 100%)', color: '#fff', padding: '44px 40px', marginBottom: '30px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />
        <div style={{ position: 'absolute', right: '90px', bottom: '-70px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'relative', maxWidth: '560px' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', padding: '6px 13px', borderRadius: '30px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>Yozgi chegirmalar · 40% gacha</span>
          <h1 style={{ fontSize: '38px', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Zamonaviy texnika<br />arzon narxlarda</h1>
          <p style={{ fontSize: '16px', opacity: 0.92, margin: '0 0 24px', lineHeight: 1.5 }}>Smartfonlar, noutbuklar, quloqchinlar va aksessuarlar — rasmiy kafolat va tez yetkazib berish bilan.</p>
          <button onClick={scrollToGrid} className="hbg-lite" style={{ background: '#fff', color: '#4F46E5', border: 'none', padding: '13px 26px', borderRadius: '11px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Xaridni boshlash</button>
        </div>
      </div>

      {/* KATEGORIYA CHIPLARI */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '18px' }}>
        {CHIPS.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={{ padding: '9px 17px', borderRadius: '30px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', border: active ? '1px solid #4F46E5' : '1px solid #e5e7eb', background: active ? '#4F46E5' : '#fff', color: active ? '#fff' : '#374151' }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* SARALASH QATORI */}
      <div className="mp-stack" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '22px' }}>
        <div style={{ color: '#6b7280', fontSize: '14.5px' }}>{filtered.length} ta mahsulot topildi</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>Saralash:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} style={{ padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff', fontSize: '14px', cursor: 'pointer', outline: 'none', color: '#374151' }}>
            <option value="default">Tavsiya etilgan</option>
            <option value="price-asc">Narx: arzon → qimmat</option>
            <option value="price-desc">Narx: qimmat → arzon</option>
            <option value="name">Nom bo'yicha (A→Z)</option>
          </select>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', padding: '14px' }}>
              <div style={{ height: '170px', borderRadius: '11px', background: 'linear-gradient(100deg,#f0f0f5 30%,#e7e7ef 50%,#f0f0f5 70%)', backgroundSize: '200% 100%', animation: 'mpsh 1.2s infinite' }} />
              <div style={{ height: '13px', width: '55%', borderRadius: '6px', background: '#eeeef4', margin: '16px 0 10px' }} />
              <div style={{ height: '17px', width: '80%', borderRadius: '6px', background: '#eeeef4', marginBottom: '16px' }} />
              <div style={{ height: '38px', borderRadius: '9px', background: '#f2f2f7' }} />
            </div>
          ))}
        </div>
      )}

      {/* BO'SH NATIJA */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #ececf3', borderRadius: '18px' }}>
          <div style={{ fontSize: '54px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Hech narsa topilmadi</h3>
          <p style={{ color: '#6b7280', margin: '0 0 22px' }}>"{search}" bo'yicha mahsulot yo'q. Boshqa so'z bilan urinib ko'ring.</p>
          <button onClick={clearFilters} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Filtrlarni tozalash</button>
        </div>
      )}

      {/* MAHSULOTLAR GRID */}
      {!loading && filtered.length > 0 && (
        <div>
          <div id="mp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {pageProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
              <button onClick={() => currentPage > 1 && goPage(currentPage - 1)} disabled={currentPage <= 1} style={navBtn(currentPage <= 1)}>←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => goPage(n)} style={{ width: '40px', height: '40px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', border: n === currentPage ? '1px solid #4F46E5' : '1px solid #e5e7eb', background: n === currentPage ? '#4F46E5' : '#fff', color: n === currentPage ? '#fff' : '#374151' }}>{n}</button>
              ))}
              <button onClick={() => currentPage < totalPages && goPage(currentPage + 1)} disabled={currentPage >= totalPages} style={navBtn(currentPage >= totalPages)}>→</button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function navBtn(disabled: boolean) {
  return { width: '40px', height: '40px', borderRadius: '10px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid #e5e7eb', background: '#fff', color: disabled ? '#cbd0dc' : '#374151' } as const;
}
