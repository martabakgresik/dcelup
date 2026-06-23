import { useState, useEffect } from 'react'
import { LayoutList, Tag, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [stats, setStats] = useState({ menus: 0, promos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats (we can approximate or fetch the actual data)
    Promise.all([
      fetch('/api/menus').then(res => res.json()),
      fetch('/api/promos').then(res => res.json())
    ])
    .then(([menusData, promosData]) => {
      setStats({
        menus: menusData.success && menusData.data ? menusData.data.length : 0,
        promos: promosData.success && promosData.data ? promosData.data.length : 0
      })
    })
    .catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '2rem' }}>Loading Overview...</div>

  const StatCard = ({ title, value, icon, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel" 
      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}
    >
      <div style={{ backgroundColor: `rgba(${color}, 0.2)`, padding: '1rem', borderRadius: '12px', color: `rgb(${color})` }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
        <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontFamily: 'Outfit, sans-serif' }}>{value}</h3>
      </div>
    </motion.div>
  )

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>Selamat Datang, Admin!</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Berikut adalah ringkasan sistem D'Celup Chicken Crispy hari ini.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Total Menu" value={stats.menus} icon={<LayoutList size={28} />} color="255, 215, 0" delay={0.1} />
        <StatCard title="Promo Aktif" value={stats.promos} icon={<Tag size={28} />} color="239, 68, 68" delay={0.2} />
        <StatCard title="Pengunjung" value="-" icon={<Users size={28} />} color="59, 130, 246" delay={0.3} />
        <StatCard title="Penjualan (Dummy)" value="Rp 0" icon={<TrendingUp size={28} />} color="16, 185, 129" delay={0.4} />
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Status Sistem</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <span>Website Online & Berjalan Normal</span>
        </div>
      </div>
    </div>
  )
}
