import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

export default function Dashboard() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Menyimpan...')
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
        setMessage('Pengaturan berhasil disimpan!')
      } else {
        setMessage('Gagal: ' + data.error)
      }
    } catch (err: any) {
      setMessage('Terjadi kesalahan saat menyimpan.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  if (loading) return <div className="app-container"><p>Loading Dashboard...</p></div>

  return (
    <div className="app-container" style={{ backgroundColor: '#fff', color: '#333', padding: '2rem', borderRadius: '8px' }}>
      <h2>Dashboard Admin</h2>
      <button onClick={() => { localStorage.removeItem('admin_token'); navigate('/') }} style={{ marginBottom: '2rem' }}>Logout</button>
      
      <h3>Pengaturan Tampilan & Maintenance</h3>
      {message && <p style={{ backgroundColor: '#eee', padding: '10px' }}>{message}</p>}
      
      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Judul Header</label>
        <input name="header_title" value={settings.header_title || ''} onChange={handleChange} />
        
        <label>Sub-Judul Header</label>
        <input name="header_subtitle" value={settings.header_subtitle || ''} onChange={handleChange} />
        
        <label>Slogan Header</label>
        <input name="header_slogan" value={settings.header_slogan || ''} onChange={handleChange} />

        <label>Alamat Footer</label>
        <input name="footer_address" value={settings.footer_address || ''} onChange={handleChange} />

        <label>Nomor WhatsApp</label>
        <input name="whatsapp_number" value={settings.whatsapp_number || ''} onChange={handleChange} />

        <label>Mode Maintenance?</label>
        <select name="is_maintenance" value={settings.is_maintenance || 'false'} onChange={handleChange}>
          <option value="false">Tidak (Aktif)</option>
          <option value="true">Ya (Sedang Perbaikan)</option>
        </select>

        <label>Pesan Maintenance</label>
        <input name="maintenance_message" value={settings.maintenance_message || ''} onChange={handleChange} />

        <button type="submit" style={{ padding: '10px', marginTop: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Simpan Pengaturan
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }}/>
      
      <p><i>Catatan: Fitur tambah/edit menu dan promo dapat dibangun dengan struktur antarmuka yang serupa di dashboard ini.</i></p>
    </div>
  )
}
