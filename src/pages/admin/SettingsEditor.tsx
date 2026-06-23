import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

export default function SettingsEditor() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ text: '', type: '' })
    const token = localStorage.getItem('admin_token')
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' })
        setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      } else {
        setMessage({ text: 'Gagal: ' + data.error, type: 'error' })
      }
    } catch (err: any) {
      setMessage({ text: 'Terjadi kesalahan saat menyimpan.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Settings...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--accent-yellow)' }}>Pengaturan Website</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Kelola informasi toko dan mode perbaikan di sini.</p>
        </div>
      </div>

      {message.text && (
        <div style={{ 
          backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
          color: message.type === 'success' ? '#a7f3d0' : '#fca5a5', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem', 
          border: `1px solid ${message.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` 
        }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Card Informasi */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ margin: 0, borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Informasi Utama</h3>
          
          <div className="form-group">
            <label>Judul Header</label>
            <input className="glass-input" name="header_title" value={settings.header_title || ''} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Sub-Judul Header</label>
            <input className="glass-input" name="header_subtitle" value={settings.header_subtitle || ''} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Slogan Header</label>
            <input className="glass-input" name="header_slogan" value={settings.header_slogan || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Alamat Footer</label>
            <input className="glass-input" name="footer_address" value={settings.footer_address || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Nomor WhatsApp</label>
            <input className="glass-input" name="whatsapp_number" value={settings.whatsapp_number || ''} onChange={handleChange} />
          </div>
        </div>

        {/* Card Maintenance */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ margin: 0, borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', color: '#fca5a5' }}>Mode Maintenance</h3>
          
          <div className="form-group">
            <label>Aktifkan Mode Maintenance?</label>
            <select className="glass-input" name="is_maintenance" value={settings.is_maintenance || 'false'} onChange={handleChange} style={{ cursor: 'pointer' }}>
              <option value="false" style={{ color: '#000' }}>Tidak (Website Online)</option>
              <option value="true" style={{ color: '#000' }}>Ya (Website Sedang Diperbaiki)</option>
            </select>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
              Jika aktif, pengunjung tidak bisa melihat menu dan hanya akan melihat halaman perbaikan.
            </small>
          </div>

          <div className="form-group">
            <label>Pesan Maintenance</label>
            <textarea 
              className="glass-input" 
              name="maintenance_message" 
              value={settings.maintenance_message || ''} 
              onChange={handleChange} 
              rows={4}
              placeholder="Contoh: Maaf, website sedang dalam perbaikan rutin."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }} disabled={isSaving}>
            <Save size={20} />
            {isSaving ? 'MENYIMPAN...' : 'SIMPAN PENGATURAN'}
          </button>
        </div>
      </form>
    </div>
  )
}
