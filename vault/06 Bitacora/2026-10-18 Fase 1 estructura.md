---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Fase 1: reorganización del repo

## Qué se hizo
- Confirmado el stack **Node + Express** → ADR-001 a 004 pasan a *aceptada*.
- Front movido a `client/` (historial git conservado con `git mv`). Título y `lang="es"` corregidos en `index.html`.
- `server/` con Express 5 y carpetas MVC; endpoint de ejemplo `GET /api/health`.
- `docker-compose.yml` con PostgreSQL 16 + `database/schema.sql` (5 tablas) + `database/seed.sql` (2 usuarios, 4 mascotas corregidas, 7 testimonios).
- npm workspaces y scripts raíz (`dev`, `db:up`, `db:reset`, `db:psql`…). README nuevo.
- Fotos de mascotas a `client/public/img/mascotas/`.

## Verificado
- `npm run build` ✅
- API arranca; `/api/health` responde y devuelve 503 con mensaje claro si la BD está apagada; rutas inexistentes → 404 JSON ✅
- Postgres 16 en Docker ✅ (el daemon estaba instalado pero apagado; se activó con `systemctl enable --now docker`). Schema y seed cargan sin errores: 2 usuarios, 4 mascotas, 7 testimonios. Hash bcrypt de admin verificado.
- `/api/health` → `{"db":"ok","mascotas":4}` directo y a través del proxy de Vite ✅. Fotos servidas desde `/img/mascotas/` ✅

## Siguiente
[[Roadmap#Fase 2 — Backend|Fase 2]]: modelos y controladores de mascotas, solicitudes, donaciones y testimonios.
