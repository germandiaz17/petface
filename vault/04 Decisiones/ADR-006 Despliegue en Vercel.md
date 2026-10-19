---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-006 · Despliegue en Vercel + Neon + Vercel Blob

**Contexto**: el repo ya estaba vinculado a Vercel (versión vieja, solo front). Tras la reestructuración el despliegue fallaba: Node 20 retirado por Vercel, la web ahora se compila en `client/dist` y hace falta backend y base de datos.

**Decisión**
- **Todo en Vercel, una sola URL**: front estático (`client/dist`) + API Express como función serverless (`api/index.js` exporta la app). `vercel.json` redirige `/api/*` a la función y el resto a `index.html` (SPA).
- **Base de datos: Neon** (Postgres serverless). Mismo código `pg`; solo cambia `DATABASE_URL`. Pool de 3 conexiones por instancia en Vercel.
- **Preparación de la BD en el build** (`server/scripts/migrar.js` dentro de `npm run vercel-build`): si no existe la tabla `usuarios`, ejecuta `schema.sql` + `seed.sql` en una transacción; si existe, no hace nada. Así nadie tiene que copiar credenciales para inicializarla y un redeploy nunca borra datos.
- **Fotos: Vercel Blob** (store `petface-fotos`, público) cuando existe `BLOB_READ_WRITE_TOKEN`; en local siguen en `server/uploads/` ([[ADR-005 Fotos en disco local]]). multer pasa a memoria y el controlador decide dónde guardar.
- **Node 24** en `package.json` (`engines`) y en la configuración del proyecto.
- **`JWT_SECRET` obligatorio en producción**: la API no arranca sin él (un secreto por defecto permitiría falsificar sesiones).

**Alternativas**: Render (front + API + Postgres en un servicio; menos cambios pero se "duerme" en el plan gratis); front en Vercel + API en otro host (dos URLs y cookies entre dominios).

**Consecuencias**: el límite de 4,5 MB por petición de Vercel obligó a bajar las fotos a 4 MB. El límite de intentos de login vive en memoria de cada instancia (aceptable para el alcance).
