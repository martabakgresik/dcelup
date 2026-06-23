import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setError('Terjadi kesalahan')
    }
  }

  return (
    <div className="app-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="password" 
          placeholder="Masukkan password admin..." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.8rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: 'var(--accent-yellow)', border: 'none', fontWeight: 'bold' }}>
          MASUK
        </button>
      </form>
      {error && <p style={{ color: 'yellow', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}
