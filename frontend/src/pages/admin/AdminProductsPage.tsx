import { useState, type CSSProperties } from 'react';
import type { Product } from '../../types/shop';
import type { ProductPayload } from '../../types/product';
import { useData } from '../../context/DataContext';
import { formatSom } from '../../lib/format';
import { imageStyle } from '../../lib/ui';

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: number;
  imageUrl: string;
}

const labelStyle: CSSProperties = { display: 'block', fontSize: '13.5px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 };
const fieldStyle: CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e5e7eb', borderRadius: '10px', outline: 'none', fontSize: '14.5px' };
const overlay: CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,12,40,0.5)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'grid', placeItems: 'center', padding: '20px' };

export function AdminProductsPage() {
  const { products, categories, createProduct, updateProduct, deleteProduct } = useData();

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', description: '', price: '', stock: '', categoryId: 0, imageUrl: '' });
  const [formErr, setFormErr] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const emptyForm = (): FormState => ({ name: '', description: '', price: '', stock: '', categoryId: categories[0]?.id ?? 0, imageUrl: '' });

  const openNew = () => {
    setEditingId('new');
    setForm(emptyForm());
    setFormErr(false);
  };
  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.desc, price: String(p.price), stock: String(p.stock), categoryId: p.categoryId ?? categories[0]?.id ?? 0, imageUrl: p.img });
    setFormErr(false);
  };
  const closeModal = () => setEditingId(null);

  const save = async () => {
    const price = parseInt(String(form.price).replace(/\D/g, ''), 10);
    if (form.name.trim().length < 2 || !price || !form.categoryId) {
      setFormErr(true);
      return;
    }
    const payload: ProductPayload = {
      name: form.name.trim(),
      description: form.description,
      price,
      imageUrl: form.imageUrl,
      stock: parseInt(String(form.stock).replace(/\D/g, ''), 10) || 0,
      categoryId: form.categoryId,
    };
    try {
      if (editingId === 'new') await createProduct(payload);
      else if (typeof editingId === 'number') await updateProduct(editingId, payload);
      setEditingId(null);
    } catch {
      setFormErr(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '14.5px' }}>Jami {products.length} ta mahsulot</p>
        <button onClick={openNew} className="hbg-primary" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>+ Yangi mahsulot</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ececf3', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ background: '#fafafc', textAlign: 'left', color: '#6b7280', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Mahsulot</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Kategoriya</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Narx</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stockStyle: CSSProperties = {
                  padding: '4px 10px', borderRadius: '7px', fontSize: '12.5px', fontWeight: 700,
                  background: p.stock <= 0 ? '#fee2e2' : p.stock <= 5 ? '#fef3c7' : '#dcfce7',
                  color: p.stock <= 0 ? '#b91c1c' : p.stock <= 5 ? '#b45309' : '#15803d',
                };
                return (
                  <tr key={p.id} style={{ borderTop: '1px solid #f2f2f7' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ ...imageStyle(p), width: '44px', height: '44px', borderRadius: '9px', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#6b7280', fontSize: '14px' }}>{p.categoryName ?? '—'}</td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, fontSize: '14px' }}>{formatSom(p.price)}</td>
                    <td style={{ padding: '12px 18px' }}><span style={stockStyle}>{p.stock <= 0 ? 'Tugagan' : `${p.stock} dona`}</span></td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => openEdit(p)} style={{ background: '#eef0ff', color: '#4F46E5', border: 'none', padding: '7px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginRight: '6px', fontSize: '13px' }}>Tahrirlash</button>
                      <button onClick={() => setDeleteTarget(p)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '7px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>O'chirish</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mahsulot forma modal */}
      {editingId !== null && (
        <div onClick={closeModal} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{editingId === 'new' ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}</h2>
              <button onClick={closeModal} style={{ background: '#f2f2f7', border: 'none', width: '34px', height: '34px', borderRadius: '9px', fontSize: '17px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Mahsulot nomi</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Masalan: Galaxy S24" style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tavsif</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Mahsulot haqida..." rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>
              <div className="mp-stack" style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Narx (so'm)</label>
                  <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0" style={fieldStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock (dona)</label>
                  <input value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} placeholder="0" style={fieldStyle} />
                </div>
              </div>
              <div className="mp-stack" style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Kategoriya</label>
                  <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))} style={{ ...fieldStyle, background: '#fff' }}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Rasm URL</label>
                  <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." style={fieldStyle} />
                </div>
              </div>
              {formErr && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 12px', borderRadius: '9px', fontSize: '13.5px' }}>Nomi, narx va kategoriyani to'g'ri kiriting</div>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button onClick={closeModal} style={{ flex: 1, background: '#f2f2f7', color: '#374151', border: 'none', padding: '13px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Bekor qilish</button>
                <button onClick={save} className="hbg-primary" style={{ flex: 1, background: '#4F46E5', color: '#fff', border: 'none', padding: '13px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Saqlash</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish tasdiq modal */}
      {deleteTarget && (
        <div onClick={() => setDeleteTarget(null)} style={overlay}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '380px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', display: 'grid', placeItems: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🗑</div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 8px' }}>Mahsulotni o'chirish</h2>
            <p style={{ color: '#6b7280', margin: '0 0 22px', fontSize: '14.5px' }}>"{deleteTarget.name}" o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, background: '#f2f2f7', color: '#374151', border: 'none', padding: '12px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>Bekor</button>
              <button onClick={confirmDelete} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '12px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer' }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
