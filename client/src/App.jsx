import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { RutaPrivada } from './components/RutaPrivada'
import { Inicio } from './pages/Inicio'
import { Adopta } from './pages/Adopta'
import { DetalleMascota } from './pages/DetalleMascota'
import { Donar } from './pages/Donar'
import { Nosotros } from './pages/Nosotros'
import { Perfil } from './pages/Perfil'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { NoEncontrada } from './pages/NoEncontrada'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminResumen } from './pages/admin/AdminResumen'
import { AdminMascotas } from './pages/admin/AdminMascotas'
import { AdminMascotaForm } from './pages/admin/AdminMascotaForm'
import { AdminSolicitudes } from './pages/admin/AdminSolicitudes'
import { AdminTestimonios } from './pages/admin/AdminTestimonios'
import { AdminDonaciones } from './pages/admin/AdminDonaciones'

// Mapa de rutas de la app (ver vault/02 Arquitectura/Secciones de la app.md)
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/adopta" element={<Adopta />} />
        <Route path="/mascotas/:id" element={<DetalleMascota />} />
        <Route path="/donar" element={<Donar />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />

        <Route path="/admin" element={<RutaPrivada soloAdmin><AdminLayout /></RutaPrivada>}>
          <Route index element={<AdminResumen />} />
          <Route path="mascotas" element={<AdminMascotas />} />
          <Route path="mascotas/nueva" element={<AdminMascotaForm />} />
          <Route path="mascotas/:id" element={<AdminMascotaForm />} />
          <Route path="solicitudes" element={<AdminSolicitudes />} />
          <Route path="testimonios" element={<AdminTestimonios />} />
          <Route path="donaciones" element={<AdminDonaciones />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* Login y registro van sin navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App
