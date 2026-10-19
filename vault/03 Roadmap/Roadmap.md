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

## Fase 2 — Backend
- [x] Conexión a BD (`pg`) — `server/src/config/db.js`
- [ ] Modelos: Usuario, Mascota, Solicitud, Donacion, Testimonio
- [ ] Controladores + rutas según [[API REST]]
- [ ] Middleware de errores y validación

## Fase 3 — Login real
- [ ] Registro / login / logout / me con bcrypt + JWT ([[Autenticación]])
- [ ] AuthContext y rutas protegidas en React

## Fase 4 — CRUD y secciones
- [ ] Router con todas las [[Secciones de la app]]
- [ ] Catálogo con filtros + detalle
- [ ] Panel admin: CRUD de mascotas
- [ ] Solicitudes de adopción (crear, ver mías, aprobar/rechazar)
- [ ] Donaciones y testimonios conectados a la BD

## Fase 5 — Diseño
- [ ] Tokens de diseño y estilos base ([[Guía de diseño]])
- [ ] Navbar + footer responsive
- [ ] Rediseño de todas las páginas, mobile-first
- [ ] Optimizar imágenes

## Fase 6 — Calidad y entrega
- [ ] Lint en 0 errores
- [ ] Pruebas básicas de la API
- [ ] README con instrucciones y capturas
- [ ] Datos de demo y usuario admin para la presentación
