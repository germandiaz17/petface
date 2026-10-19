---
tags: [roadmap]
actualizado: 2026-10-18
---
# Roadmap

> [!note] Fases pequeñas, cada una deja la app funcionando. Marca las casillas al avanzar.

## Fase 0 — Análisis y cerebro ✅
- [x] Análisis profundo del código → [[Estado actual]], [[Problemas detectados]]
- [x] Vault de Obsidian
- [x] Validar propuestas (Node + Express confirmado el 2026-10-18)

## Fase 1 — Reorganizar el repo ✅
- [x] Mover el front a `client/` ([[ADR-004 Estructura del repositorio]])
- [x] Crear `server/` con Express y estructura MVC
- [x] `docker-compose.yml` con PostgreSQL + `database/schema.sql` + `seed.sql`
- [x] Scripts `npm run dev` que levanten front y back
- [x] `.env.example`, README real

## Fase 2 — Backend ✅
- [x] Conexión a BD (`pg`) — `server/src/config/db.js`
- [x] Modelos: Mascota, Solicitud, Donacion, Testimonio (Usuario → Fase 3)
- [x] Controladores + rutas según [[API REST]]
- [x] Middleware de errores y validación

## Fase 3 — Login real ✅
- [x] Middleware JWT (`cargarUsuario`, `requireAuth`, `requireAdmin`) — adelantado en Fase 2
- [x] Modelo Usuario
- [x] Registro / login / logout / me con bcrypt + JWT ([[Autenticación]])
- [x] AuthContext, rutas protegidas y pantallas de login/registro rediseñadas

## Fase 4 — CRUD y secciones ✅
- [x] Router con todas las [[Secciones de la app]]
- [x] Catálogo con filtros + detalle
- [x] Panel admin: CRUD de mascotas
- [x] Solicitudes de adopción (crear, ver mías, aprobar/rechazar)
- [x] Donaciones y testimonios conectados a la BD

## Fase 5 — Diseño
- [x] Tokens de diseño y estilos base ([[Guía de diseño]]) — adelantado en Fase 3/4
- [x] Navbar + footer responsive — adelantado en Fase 4
- [ ] Rediseño de todas las páginas, mobile-first
- [x] Optimizar imágenes (portada 422 KB → 74 KB)
- [ ] Tablas del admin en móvil (hoy hacen scroll horizontal)
- [ ] Subir fotos de mascotas desde el admin (hoy se pega una URL)
- [ ] Revisión visual completa y detalles finos

## Fase 6 — Calidad y entrega
- [x] Lint en 0 errores (desde la Fase 3)
- [x] Pruebas básicas de la API (`npm test`, 11 pruebas)
- [ ] README con instrucciones y capturas
- [ ] Datos de demo y usuario admin para la presentación
