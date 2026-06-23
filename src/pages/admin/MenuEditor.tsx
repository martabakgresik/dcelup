import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Heart } from 'lucide-react'

export default function MenuEditor() {
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ id: '', category: '', name: '', price: '', image_url: '/dcelup.jpg' })
  
  const token = localStorage.getItem('admin_token')

  const fetchMenus = () => {
    setLoading(true)
    fetch('/api/menus')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMenus(data.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = formData.id ? 'PUT' : 'POST'
    
    try {
      const res = await fetch('/api/menus', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: formData.id,
          category: formData.category,
          name: formData.name,
          price: parseInt(formData.price),
          image_url: formData.image_url
        })
      })
      const data = await res.json()
      if (data.success) {
        setIsEditing(false)
        setFormData({ id: '', category: '', name: '', price: '', image_url: '/dcelup.jpg' })
        fetchMenus()
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return
    
    try {
      const res = await fetch(`/api/menus?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchMenus()
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    }
  }

  const handleEditClick = (menu: any) => {
    setFormData({ id: menu.id, category: menu.category, name: menu.name, price: menu.price.toString(), image_url: menu.image_url || '/dcelup.jpg' })
    setIsEditing(true)
  }

  if (loading) return <div>Memuat menu...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Daftar Menu</h3>
        {!isEditing && (
          <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Plus size={18} /> Tambah Menu
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--accent-yellow)' }}>{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h4>
            <button onClick={() => { setIsEditing(false); setFormData({ id: '', category: '', name: '', price: '', image_url: '/dcelup.jpg' }) }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Kategori</label>
              <input 
                className="glass-input" 
                placeholder="Misal: Paket Combo" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nama Menu</label>
              <input 
                className="glass-input" 
                placeholder="Misal: D'Celup 1" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input 
                type="number" 
                className="glass-input" 
                placeholder="Misal: 15000" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Gambar Menu (URL)</label>
              <input 
                className="glass-input" 
                placeholder="Misal: /dcelup.jpg atau https://..." 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Simpan Menu</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kategori</th>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Harga</th>
              <th style={{ textAlign: 'center' }}>Disukai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Belum ada menu.</td></tr>
            ) : (
              menus.map(menu => (
                <tr key={menu.id}>
                  <td>{menu.id}</td>
                  <td><span style={{ background: 'rgba(255,215,0,0.1)', color: 'var(--accent-yellow)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{menu.category}</span></td>
                  <td>
                    <img src={menu.image_url || '/dcelup.jpg'} alt={menu.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{menu.name}</td>
                  <td>Rp. {menu.price.toLocaleString('id-ID')}</td>
                  <td style={{ textAlign: 'center', color: '#fca5a5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Heart size={14} fill="currentColor" /> {menu.favorites_count || 0}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-secondary" onClick={() => handleEditClick(menu)} title="Edit"><Edit2 size={16} /></button>
                      <button className="btn-danger" onClick={() => handleDelete(menu.id)} title="Hapus"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
