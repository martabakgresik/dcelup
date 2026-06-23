import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, LayoutList, Tag, Settings, LogOut, Home, Menu as MenuIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import '../App.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const navLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/admin/menus', icon: <LayoutList size={20} />, label: 'Menu' },
    { to: '/admin/promos', icon: <Tag size={20} />, label: 'Promo' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
  ]

  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        <h2 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--accent-yellow)', margin: 0, fontSize: '1.8rem' }}>D'CELUP</h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link" style={{ textDecoration: 'none' }}>
          <Home size={20} />
          <span>Ke Website</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link btn-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar hidden-mobile">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="admin-mobile-header hidden-desktop">
        <h2 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--accent-yellow)', margin: 0, fontSize: '1.5rem' }}>D'CELUP</h2>
        <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-menu-btn">
          <MenuIcon size={24} color="#fff" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="admin-sidebar mobile-sidebar"
            >
              <button onClick={() => setIsMobileMenuOpen(false)} className="close-sidebar-btn">
                <X size={24} color="#fff" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="admin-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
