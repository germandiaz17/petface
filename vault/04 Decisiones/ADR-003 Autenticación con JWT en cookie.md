---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-003 · Autenticación con bcrypt + JWT en cookie httpOnly

**Decisión**: contraseñas con `bcryptjs` (versión JS pura de bcrypt); sesión con un JWT guardado en cookie `httpOnly`, `sameSite=lax`. Roles `admin` / `adoptante`.

**Alternativas**: `express-session` con tabla de sesiones (más piezas); JWT en `localStorage` (más simple pero expuesto a XSS).

**Consecuencias**: el front usa `fetch(..., { credentials: 'include' })`; en desarrollo Vite hace *proxy* de `/api` al backend para evitar líos de CORS.

Detalle: [[Autenticación]].
