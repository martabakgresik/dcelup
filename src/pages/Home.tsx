import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, MapPin, Phone, ShoppingCart, Plus, Minus, X, Trash2, Heart } from 'lucide-react'
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
  
  // Cart State
  const [cartItems, setCartItems] = useState<(MenuItem & { quantity: number })[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Favorites State
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    const savedFavs = localStorage.getItem('dcelup_favorites')
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs))
    }

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

  const toggleFavorite = async (id: number) => {
    setFavorites(prev => {
      const isFav = prev.includes(id)
      const newFavs = isFav ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('dcelup_favorites', JSON.stringify(newFavs))
      
      // Send update to server (fire and forget)
      fetch('/api/menus/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: isFav ? 'remove' : 'add' })
      }).catch(console.error);

      return newFavs
    })
  }

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta)
        return { ...i, quantity: newQty }
      }
      return i
    }).filter(i => i.quantity > 0))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    let phone = settings.whatsapp_number || ''
    phone = phone.replace(/\D/g, '')
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1)
    }
    
    let message = `Halo D'CELUP, saya ingin memesan:\n\n`
    let total = 0
    
    cartItems.forEach(item => {
      const subtotal = item.price * item.quantity
      total += subtotal
      message += `- ${item.quantity}x ${item.name} (Rp ${subtotal.toLocaleString('id-ID')})\n`
    })
    
    message += `\n*Total Pesanan: Rp ${total.toLocaleString('id-ID')}*\n\nMohon info ketersediaan dan pengiriman. Terima kasih!`
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="app-container">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hero-section"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <img src="/dcelup.jpg" alt="D'Celup Logo" style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-yellow)', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }} />
          <h1 className="hero-title" style={{ margin: 0 }}>{settings.header_title || "D'CELUP"}</h1>
        </div>
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
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.3rem' }}>
            <button 
              onClick={() => setShowFavoritesOnly(false)}
              style={{ background: !showFavoritesOnly ? 'var(--accent-yellow)' : 'transparent', color: !showFavoritesOnly ? '#1a1a1a' : '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Semua Menu
            </button>
            <button 
              onClick={() => setShowFavoritesOnly(true)}
              style={{ background: showFavoritesOnly ? 'var(--accent-yellow)' : 'transparent', color: showFavoritesOnly ? '#1a1a1a' : '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Heart size={16} fill={showFavoritesOnly ? '#1a1a1a' : 'none'} /> Favorit Saya
            </button>
          </div>
        </div>

        {Object.keys(categories).map((category, index) => {
          const categoryItems = categories[category].filter(item => showFavoritesOnly ? favorites.includes(item.id) : true)
          if (categoryItems.length === 0) return null

          return (
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
                {categoryItems.map(item => (
                  <div key={item.id} className="glass-panel menu-card">
                    <button 
                      onClick={() => toggleFavorite(item.id)}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
                    >
                      <Heart size={24} color={favorites.includes(item.id) ? '#ef4444' : '#9ca3af'} fill={favorites.includes(item.id) ? '#ef4444' : 'none'} style={{ transition: 'all 0.2s' }} />
                    </button>
                    <div>
                      <div className="menu-card-category">{item.category}</div>
                    <div className="menu-card-title">{item.name}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div className="menu-card-price" style={{ margin: 0 }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      style={{ 
                        background: 'rgba(255, 215, 0, 0.2)', color: 'var(--accent-yellow)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: '8px', 
                        padding: '0.4rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' 
                      }}
                    >
                      <ShoppingCart size={16} /> + Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          )
        })}
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

      {/* Floating Cart Box */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="floating-cart-box"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="cart-box-info">
              <span className="cart-box-qty">{totalCartItems} Keranjang</span>
              <span className="cart-box-price">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="cart-box-icon">
              <ShoppingCart size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="cart-drawer"
              onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <div className="cart-header">
                <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingCart size={24} color="var(--accent-yellow)" /> Keranjang
                </h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {cartItems.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Keranjang masih kosong.</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-title">{item.name}</div>
                        <div className="cart-item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>
                          {item.quantity === 1 ? <Trash2 size={14} color="#ef4444" /> : <Minus size={14} />}
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span style={{ color: 'var(--accent-yellow)' }}>Rp {totalCartPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  className="btn-whatsapp" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  style={{ opacity: cartItems.length === 0 ? 0.5 : 1 }}
                >
                  <ShoppingCart size={20} /> Checkout ke WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>
          design by <a href="https://ariftirtana.my.id" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-yellow)', textDecoration: 'none', fontWeight: 'bold' }}>arif tirtana</a>
        </p>
      </footer>
    </div>
  )
}
