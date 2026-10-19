---
tags: [arquitectura, api]
estado: implementado (Fase 2)
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
| GET | `/testimonios/todos` | 🛡️ | Todos, incluidos los pendientes |
| PATCH | `/testimonios/:id` | 🛡️ | Aprobar / desaprobar `{ aprobado: true }` |
| DELETE | `/testimonios/:id` | 🛡️ | Borrar |

## Admin
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/admin/resumen` | 🛡️ | Contadores: mascotas y solicitudes por estado, total donado |

## Errores
`{ "error": "mensaje legible" }` con código HTTP correcto (400 validación, 401 sin sesión, 403 sin permiso, 404, 409 duplicado).

## Cómo se protege cada ruta
- `cargarUsuario` (global, en `app.js`): si llega un JWT válido en la cookie `token` o en `Authorization: Bearer <token>`, deja `req.user = { id, nombre, email, rol }`.
- `requireAuth` → 401 si no hay sesión. `requireAdmin` → 401 sin sesión, 403 si no es admin.
- Se declaran en cada archivo de `routes/`, por ejemplo `router.post('/', requireAdmin, ctrl.crear)`.

## Probar a mano
```bash
curl localhost:3000/api/mascotas?especie=gato
curl localhost:3000/api/mascotas?q=golden
```
Las rutas protegidas necesitan token; el login llega en la Fase 3. Mientras tanto, las pruebas (`npm test`) generan tokens directamente.
