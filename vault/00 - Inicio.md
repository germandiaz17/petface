---
tags: [moc]
actualizado: 2026-10-18
---
# 🐾 PetFace — Cerebro del proyecto

PetFace es una web de **adopción de mascotas** (proyecto universitario). Este vault es la memoria compartida del proyecto: qué hay, qué decidimos y qué falta.

> [!success] Estado (2026-10-18): las 6 fases del [[Roadmap]] están completas
> React + Express (MVC) + PostgreSQL · login con roles · CRUD de mascotas con subida de fotos · flujo de adopción completo · panel de admin · responsive · 17 pruebas automáticas. Para presentar: [[Guía de sustentación]].

> [!info] Cómo usar este vault
> - Antes de trabajar en algo, lee la nota de su área y el [[Roadmap]].
> - Cada decisión importante va en `04 Decisiones/` como un ADR corto.
> - Al terminar una sesión de trabajo, agrega una entrada en `06 Bitacora/`.

## Mapa
### 01 · Análisis (estado actual)
- [[Estado actual]] — qué es hoy el proyecto, en una página
- [[Inventario de archivos]] — qué hace cada archivo
- [[Problemas detectados]] — bugs, deuda técnica y riesgos

### 02 · Arquitectura (a dónde vamos)
- [[Arquitectura propuesta]] — MVC con Express + React
- [[Modelo de datos]] — tablas de PostgreSQL
- [[API REST]] — endpoints
- [[Autenticación]] — el login nuevo
- [[Secciones de la app]] — páginas y rutas
- [[Plan sistemas distribuidos]] — microservicio de notificaciones, eventos, gateway y réplicas *(propuesta)*

### 03 · Roadmap
- [[Roadmap]] — fases con checklist

### 04 · Decisiones
- [[ADR-001 Stack backend]]
- [[ADR-002 Base de datos PostgreSQL]]
- [[ADR-003 Autenticación con JWT en cookie]]
- [[ADR-004 Estructura del repositorio]]
- [[ADR-005 Fotos en disco local]]
- [[ADR-006 Despliegue en Vercel]]

### 05 · Diseño
- [[Guía de diseño]]

### 07 · Presentación
- [[Guía de sustentación]] — guion de demo, MVC explicado y preguntas probables

### 06 · Bitácora
- [[2026-10-18 Análisis inicial]]
- [[2026-10-18 Fase 1 estructura]]
- [[2026-10-18 Fase 2 backend]]
- [[2026-10-18 Fase 3 login]]
- [[2026-10-18 Fase 4 secciones]]
- [[2026-10-18 Fase 5 diseño]]
- [[2026-10-18 Fase 6 entrega]]
- [[2026-10-18 Despliegue Vercel]]
