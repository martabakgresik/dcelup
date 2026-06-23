import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/admin/Login'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import MenuEditor from './pages/admin/MenuEditor'
import PromoEditor from './pages/admin/PromoEditor'
import SettingsEditor from './pages/admin/SettingsEditor'

function App() {
  return (
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
  )
}

export default App
