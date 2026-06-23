import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tag, MapPin, Phone } from 'lucide-react'
import '../App.css'

interface MenuItem {
  id: number;
  category: string;
  name: string;
  price: number;
}

interface PromoItem {
  id: number;
  title: string;
  description: string;
  discount_value: number;
  valid_until: string;
  is_active: number;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [promos, setPromos] = useState<PromoItem[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/menus').then(res => res.json()),
      fetch('/api/promos').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([menusData, promosData, settingsData]) => {
      if (menusData.success) setMenuItems(menusData.data)
      if (promosData.success) setPromos(promosData.data.filter((p: any) => p.is_active === 1))
      if (settingsData.success) setSettings(settingsData.data)
    }).catch(err => {
      setError(err.message)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ border: '4px solid rgba(255,215,0,0.3)', borderTop: '4px solid var(--accent-yellow)', borderRadius: '50%', width: '40px', height: '40px' }} />
      </div>
    )
  }

  if (settings.is_maintenance === 'true') {
    return (
      <div className="app-container" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '4rem 2rem' }}>
          <h1 className="hero-title">{settings.header_title || "D'CELUP"}</h1>
          <h2 style={{ color: 'var(--accent-yellow)', margin: '1rem 0' }}>SEDANG DALAM PERBAIKAN</h2>
          <p style={{ color: 'var(--text-muted)' }}>{settings.maintenance_message}</p>
        </motion.div>
      </div>
    )
  }

  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <div className="app-container">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hero-section"
      >
        <h1 className="hero-title">{settings.header_title || "D'CELUP"}</h1>
        <h2 className="hero-subtitle">{settings.header_subtitle || "CHICKEN CRISPY"}</h2>
        <p className="hero-slogan">{settings.header_slogan || "LEZATNYA AYAM CRISPY BERBALUT SAUS PILIHAN"}</p>
      </motion.header>

      {/* Promos Section */}
      {promos.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {promos.map(promo => (
            <div key={promo.id} className="promo-banner">
              <div className="promo-icon"><Tag size={32} /></div>
              <div className="promo-content">
                <h3>{promo.title}</h3>
                <p>{promo.description} | Hemat Rp {promo.discount_value.toLocaleString('id-ID')} | Berlaku s.d {promo.valid_until}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Menu Section */}
      <main>
        {error && <p style={{ color: '#fca5a5', textAlign: 'center' }}>Error: {error}</p>}
        
        {Object.keys(categories).map((category, index) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-yellow)', marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
              {category}
            </h3>
            
            <div className="menu-grid">
              {categories[category].map(item => (
                <div key={item.id} className="glass-panel menu-card">
                  <div>
                    <div className="menu-card-category">{item.category}</div>
                    <div className="menu-card-title">{item.name}</div>
                  </div>
                  <div className="menu-card-price">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="footer"
      >
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <MapPin size={16} color="var(--accent-yellow)" /> {settings.footer_address}
        </p>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Phone size={16} color="var(--accent-yellow)" /> Order via WhatsApp: {settings.whatsapp_number}
        </p>
      </motion.footer>
    </div>
  )
}
