---
tags: [arquitectura, auth]
estado: propuesta
actualizado: 2026-10-18
---
# Autenticación (login mejorado)

## Hoy
Solo un nombre en `useState`. Ver [[Problemas detectados#Login]].

## Propuesta
```mermaid
sequenceDiagram
  participant U as Usuario
  participant C as React
  participant S as Express
  participant D as PostgreSQL
  U->>C: email + contraseña
  C->>S: POST /api/auth/login
  S->>D: SELECT usuario por email
  S->>S: bcrypt.compare(contraseña, hash)
  S-->>C: Set-Cookie token=JWT (httpOnly) + datos usuario
  C->>C: AuthContext guarda usuario
  Note over C: Al recargar: GET /api/auth/me
```

- **Registro** con nombre, email, contraseña (mín. 8 caracteres) y teléfono opcional.
- Contraseñas con **bcrypt** (nunca en texto plano).
- **JWT** en cookie `httpOnly` (no accesible desde JS → más seguro que localStorage), expira en 7 días.
- **Roles**: `adoptante` y `admin`. Middlewares `requireAuth` y `requireAdmin`.
- En React: `AuthContext` + rutas protegidas (`<RutaPrivada>`, `<RutaAdmin>`).
- UX: mostrar/ocultar contraseña, errores por campo, botón con estado de carga, redirigir a la página que se quería ver.

Relacionado: [[ADR-003 Autenticación con JWT en cookie]].
