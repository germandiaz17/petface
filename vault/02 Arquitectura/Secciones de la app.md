---
tags: [arquitectura, ui]
estado: propuesta
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
