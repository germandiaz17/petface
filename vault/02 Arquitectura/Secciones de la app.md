---
tags: [arquitectura, ui]
estado: implementado (Fase 4)
actualizado: 2026-10-18
---
# Secciones de la app

Con `react-router-dom` (ya instalado).

| Ruta | Página | Acceso | Contenido |
|---|---|---|---|
| `/` | Inicio | 🔓 | Hero, cómo funciona la adopción, mascotas destacadas, testimonios, llamado a donar |
| `/adopta` | Catálogo | 🔓 | Grid de mascotas con filtros y búsqueda |
| `/mascotas/:id` | Detalle | 🔓 | Foto grande, datos, botón "Quiero adoptar" (pide login) |
| `/donar` | Donaciones | 🔓 | Form de donación simulado + a dónde va el dinero |
| `/nosotros` | Nosotros / Contacto | 🔓 | Misión, equipo, datos de contacto |
| `/login`, `/registro` | Auth | 🔓 | Ver [[Autenticación]] |
| `/perfil` | Mi cuenta | 👤 | Mis datos y **mis solicitudes** |
| `/admin` | Panel | 🛡️ | Resumen (contadores) |
| `/admin/mascotas` | CRUD mascotas | 🛡️ | Tabla + crear/editar/borrar |
| `/admin/solicitudes` | Solicitudes | 🛡️ | Aprobar / rechazar |
| `*` | 404 | 🔓 | Página no encontrada |

Cambio clave respecto a hoy: **el sitio público se puede ver sin login**; el login se pide solo para adoptar, testimoniar o administrar.

## Implementado (Fase 4)
Todas las rutas de la tabla existen. Archivos en `client/src/pages/` (admin en `pages/admin/`).

| Pieza | Archivo | Notas |
|---|---|---|
| Layout | `components/layout/Layout.jsx` | Navbar + `<Outlet/>` + Footer; vuelve arriba al cambiar de página |
| Navbar | `components/layout/Navbar.jsx` | Menú hamburguesa en móvil (<860px); muestra "Admin" solo a admins |
| Tarjeta de mascota | `components/PetCard.jsx` | Toda la tarjeta enlaza al detalle; foto por defecto si falla la imagen |
| Datos | `hooks/useApi.js` | `{ datos, cargando, error, recargar }` para cualquier GET |
| Avisos | `context/ToastProvider.jsx` | `useToast().exito()/error()` |
| Confirmaciones | `components/Confirmar.jsx` | Modal propio (no `window.confirm`) |
| Formato | `utils/formato.js` | Etiquetas en español, edad, fechas, pesos colombianos |

Detalles de cada página:
- **Catálogo**: filtros guardados en la URL (`/adopta?especie=gato&q=siam`), búsqueda con espera de 300 ms.
- **Detalle**: la caja de adopción cambia según el caso: sin sesión, solicitud pendiente, aprobada o mascota adoptada.
- **Donar**: montos rápidos en COP; se rellena con los datos del usuario si hay sesión. Es una simulación.
- **Perfil**: mis solicitudes (con cancelar) + formulario de testimonio (queda pendiente de aprobación).
- **Admin**: resumen con contadores, CRUD de mascotas (formulario con vista previa y edad en años/meses), aprobar/rechazar solicitudes, publicar/ocultar/eliminar testimonios, listado de donaciones.
