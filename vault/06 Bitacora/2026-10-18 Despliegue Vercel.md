---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Despliegue en Vercel

## Diagnóstico del deploy fallido
- Error en 1 s: *"Node.js Version 20.x is discontinued… set Node.js Version to 24.x"* (Vercel retiró Node 20 el 30-sep-2026).
- Problemas que venían detrás: preset "Vite" buscando `dist/` en la raíz (ahora es `client/dist`), y sin backend ni BD en Vercel.

## Qué se hizo
- Código: `vercel.json`, `api/index.js`, `server/scripts/migrar.js`, `engines.node = 24.x`, subida de fotos con Vercel Blob, `JWT_SECRET` obligatorio en producción. Ver [[ADR-006 Despliegue en Vercel]].
- En Vercel: Node.js → 24.x en *Build and Deployment*; Blob store `petface-fotos` (público) creado y conectado al proyecto (Production + Preview) con `BLOB_READ_WRITE_TOKEN`.
- Verificado en local: 17 pruebas ✅, migración sobre BD vacía (crea) y llena (no toca) ✅, simulación de la función en modo producción (health, catálogo, login con cookie `Secure`) ✅.

## Resultado
- `DATABASE_URL` y `JWT_SECRET` agregadas en Vercel (Production) por el dueño de la cuenta; push del commit `bd6e3cb`.
- Despliegue **Ready** en 22 s → **https://petface.vercel.app**
- Verificado en producción: `/api/health` → `db: ok, mascotas: 4`; catálogo con filtros, detalle de mascota, testimonios; rutas protegidas responden 401 sin sesión; rutas de la SPA (p. ej. una URL inexistente) devuelven la app; sin errores en consola.
- No verificado por Claude (requiere escribir contraseñas en un sitio público): login, panel de admin y subida de fotos a Blob → probar a mano.

## ⚠️ Pendiente importante
Las contraseñas de demo (`admin123`, etc.) están publicadas en el README y el seed, y ahora la web es pública: **cualquiera puede entrar como admin**. Cambiar la contraseña del admin en producción (no hay pantalla para hacerlo todavía; se puede con SQL en la consola de Neon o agregando "cambiar contraseña" al perfil).
