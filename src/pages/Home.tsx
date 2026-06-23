import { useState, useEffect } from 'react'
import '../App.css'

interface MenuItem {
  id: number;
  category: string;
  name: string;
  price: number;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/menus').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([menusData, settingsData]) => {
      if (menusData.success) setMenuItems(menusData.data)
      if (settingsData.success) setSettings(settingsData.data)
    }).catch(err => {
      setError(err.message)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="app-container"><p>Loading...</p></div>

  if (settings.is_maintenance === 'true') {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>{settings.header_title || "D'CELUP"}</h1>
        <h2>SEDANG MAINTENANCE</h2>
        <p>{settings.maintenance_message}</p>
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
      <header className="header">
        <h1>{settings.header_title || "D'CELUP"}</h1>
        <h2>{settings.header_subtitle || "CHICKEN CRISPY"}</h2>
        <p>{settings.header_slogan || "LEZATNYA AYAM CRISPY BERBALUT SAUS PILIHAN"}</p>
      </header>

      <main className="menu-section">
        {error && <p style={{ color: 'yellow' }}>Error: {error}</p>}
        
        {Object.keys(categories).map(category => (
          <div key={category}>
            <h3 className="section-title">{category}</h3>
            <ul className="menu-list">
              {categories[category].map(item => (
                <li key={item.id} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">Rp. {item.price.toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      <footer className="footer">
        <p>{settings.footer_address}</p>
        <p>Order By: GrabFood / WA {settings.whatsapp_number}</p>
      </footer>
    </div>
  )
}
