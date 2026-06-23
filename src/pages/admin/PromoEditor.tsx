import { useState, useEffect } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

export default function PromoEditor() {
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', discount_value: '', valid_until: '' })
  
  const token = localStorage.getItem('admin_token')

  const fetchPromos = () => {
    setLoading(true)
    fetch('/api/promos')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPromos(data.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPromos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          discount_value: parseInt(formData.discount_value),
          valid_until: formData.valid_until,
          is_active: true
        })
      })
      const data = await res.json()
      if (data.success) {
        setIsEditing(false)
        setFormData({ title: '', description: '', discount_value: '', valid_until: '' })
        fetchPromos()
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus promo ini?')) return
    
    try {
      const res = await fetch(`/api/promos?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchPromos()
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    }
  }

  if (loading) return <div>Memuat promo...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Daftar Promo</h3>
        {!isEditing && (
          <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Plus size={18} /> Tambah Promo
          </button>
        )}
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--accent-yellow)' }}>Tambah Promo Baru</h4>
            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Judul Promo</label>
              <input 
                className="glass-input" 
                placeholder="Misal: Diskon Merdeka" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nilai Diskon (Rp)</label>
              <input 
                type="number" 
                className="glass-input" 
                placeholder="Misal: 5000" 
                value={formData.discount_value} 
                onChange={e => setFormData({...formData, discount_value: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Deskripsi</label>
              <input 
                className="glass-input" 
                placeholder="Deskripsi singkat promo" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Berakhir Pada</label>
              <input 
                type="date"
                className="glass-input" 
                value={formData.valid_until} 
                onChange={e => setFormData({...formData, valid_until: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Simpan Promo</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Potongan</th>
              <th>Berlaku Sampai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Belum ada promo.</td></tr>
            ) : (
              promos.map(promo => (
                <tr key={promo.id}>
                  <td>{promo.id}</td>
                  <td style={{ fontWeight: 600 }}>{promo.title}</td>
                  <td style={{ color: 'var(--accent-yellow)' }}>Rp. {promo.discount_value.toLocaleString('id-ID')}</td>
                  <td>{promo.valid_until}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-danger" onClick={() => handleDelete(promo.id)} title="Hapus"><Trash2 size={16} /></button>
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
