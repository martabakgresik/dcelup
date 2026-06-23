import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import '../../App.css'

export default function Login() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin/dashboard')
      } else {
        setError(data.error || 'Login gagal')
      }
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', display: 'flex' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <User size={32} color="var(--accent-yellow)" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Masukkan kata sandi untuk mengelola D'CELUP</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Kata Sandi Admin..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', 
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ position: 'relative' }}>
            {loading ? 'MEMPROSES...' : 'MASUK KE DASHBOARD'}
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              marginTop: '1.5rem', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', 
              border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' 
            }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
