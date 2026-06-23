import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/admin/Login'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import MenuEditor from './pages/admin/MenuEditor'
import PromoEditor from './pages/admin/PromoEditor'
import SettingsEditor from './pages/admin/SettingsEditor'
import { useState, useEffect } from 'react'

function App() {
  const [themeSettings, setThemeSettings] = useState<any>({})

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setThemeSettings(data.data)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <style>
        {`
          :root {
            ${themeSettings.theme_accent_color ? `--accent-yellow: ${themeSettings.theme_accent_color};` : ''}
            ${themeSettings.theme_bg_color ? `--bg-dark: ${themeSettings.theme_bg_color};` : ''}
          }
        `}
      </style>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/menus" element={<MenuEditor />} />
          <Route path="/admin/promos" element={<PromoEditor />} />
          <Route path="/admin/settings" element={<SettingsEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
