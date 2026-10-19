---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Fase 2: backend y CRUD

## Qué se hizo
- Commit de la Fase 1 en la rama `robustecer`.
- Modelos, controladores y rutas de **mascotas** (CRUD completo con filtros y búsqueda), **solicitudes** (con reglas de adopción y transacciones), **donaciones** y **testimonios**. Más `GET /api/admin/resumen`.
- Validación con `utils/validar.js` y errores centralizados (`HttpError` + `errorHandler`).
- Se adelantó el **middleware de autenticación JWT** de la Fase 3 para que las rutas de admin/usuario queden protegidas desde ya. Dependencias nuevas: `jsonwebtoken`, `cookie-parser`.
- Pruebas automáticas con `node:test`: 8 pruebas, todas pasan. Crean y borran sus propios datos.

## Decisiones
- Validación hecha a mano en lugar de una librería (Joi/Zod): menos dependencias y más fácil de explicar.
- El estado de la mascota (`disponible → en_proceso → adoptada`) lo cambia el sistema según las solicitudes; el admin también puede editarlo desde el CRUD.

## Siguiente
[[Roadmap#Fase 3 — Login real|Fase 3]]: modelo Usuario, `/auth/registro`, `/auth/login`, `/auth/logout`, `/auth/me`, y AuthContext en React.
