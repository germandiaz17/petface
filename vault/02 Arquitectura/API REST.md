---
tags: [arquitectura, api]
estado: propuesta
actualizado: 2026-10-18
---
# API REST

Base: `/api`. Respuestas en JSON. 🔓 público · 👤 usuario logueado · 🛡️ admin

## Auth
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/registro` | 🔓 | Crear cuenta (rol adoptante) |
| POST | `/auth/login` | 🔓 | Login → cookie con JWT |
| POST | `/auth/logout` | 👤 | Borra la cookie |
| GET | `/auth/me` | 👤 | Usuario actual (para recargar sesión) |

## Mascotas — CRUD principal
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/mascotas` | 🔓 | Listar, con filtros `?especie=&genero=&tamano=&estado=&q=` |
| GET | `/mascotas/:id` | 🔓 | Detalle |
| POST | `/mascotas` | 🛡️ | Crear |
| PUT | `/mascotas/:id` | 🛡️ | Editar |
| DELETE | `/mascotas/:id` | 🛡️ | Borrar |

## Solicitudes de adopción
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/solicitudes` | 👤 | Solicitar adoptar una mascota |
| GET | `/solicitudes/mias` | 👤 | Mis solicitudes |
| DELETE | `/solicitudes/:id` | 👤 | Cancelar la mía (si está pendiente) |
| GET | `/solicitudes` | 🛡️ | Todas |
| PATCH | `/solicitudes/:id` | 🛡️ | Aprobar / rechazar |

## Donaciones y testimonios
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/donaciones` | 🔓 | Registrar donación (simulada, sin pago real) |
| GET | `/donaciones` | 🛡️ | Listado + total |
| GET | `/testimonios` | 🔓 | Aprobados |
| POST | `/testimonios` | 👤 | Enviar testimonio |
| PATCH | `/testimonios/:id` | 🛡️ | Aprobar |

## Errores
`{ "error": "mensaje legible" }` con código HTTP correcto (400 validación, 401 sin sesión, 403 sin permiso, 404, 409 duplicado).
