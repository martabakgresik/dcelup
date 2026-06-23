import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Settings as SettingsIcon, LayoutList, Tag, Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import MenuEditor from './MenuEditor'
import PromoEditor from './PromoEditor'
import '../../App.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'menus' | 'promos'>('settings')
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
        setTimeout(() => setMessage(''), 3000)
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

  if (loading) return <div className="app-container"><p style={{ textAlign: 'center' }}>Loading Dashboard...</p></div>

  return (
    <div className="app-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', margin: 0 }}>D'CELUP Admin</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <HomeIcon size={18} /> Ke Beranda
          </Link>
          <button 
            onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login') }} 
            className="btn-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.div>
      
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Pengaturan Umum
        </button>
        <button 
          className={`tab-btn ${activeTab === 'menus' ? 'active' : ''}`}
          onClick={() => setActiveTab('menus')}
        >
          <LayoutList size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Manajemen Menu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'promos' ? 'active' : ''}`}
          onClick={() => setActiveTab('promos')}
        >
          <Tag size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Manajemen Promo
        </button>
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel" 
        style={{ padding: '2rem' }}
      >
        {activeTab === 'settings' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-yellow)' }}>Pengaturan Tampilan & Maintenance</h3>
            {message && <p style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#a7f3d0', padding: '10px', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(76, 175, 80, 0.5)' }}>{message}</p>}
            
            <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Judul Header</label>
                <input className="glass-input" name="header_title" value={settings.header_title || ''} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label>Sub-Judul Header</label>
                <input className="glass-input" name="header_subtitle" value={settings.header_subtitle || ''} onChange={handleChange} />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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

              <div className="form-group">
                <label>Mode Maintenance?</label>
                <select className="glass-input" name="is_maintenance" value={settings.is_maintenance || 'false'} onChange={handleChange} style={{ cursor: 'pointer' }}>
                  <option value="false" style={{ color: '#000' }}>Tidak (Aktif)</option>
                  <option value="true" style={{ color: '#000' }}>Ya (Sedang Perbaikan)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pesan Maintenance</label>
                <input className="glass-input" name="maintenance_message" value={settings.maintenance_message || ''} onChange={handleChange} />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  SIMPAN PENGATURAN
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'menus' && <MenuEditor />}
        
        {activeTab === 'promos' && <PromoEditor />}
        
      </motion.div>
    </div>
  )
}
