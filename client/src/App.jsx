import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'

// Rutas de la app. Las secciones nuevas (catálogo, perfil, admin...) llegan en la Fase 4.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
