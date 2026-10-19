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

## Pendiente (lo hace el dueño de la cuenta)
1. Agregar `DATABASE_URL` (cadena *pooled* de Neon) y `JWT_SECRET` en Vercel → Environment Variables (Production y Preview).
2. `git push origin master` → Vercel despliega y la migración llena Neon con los datos de demo.
