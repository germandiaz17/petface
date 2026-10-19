---
tags: [bitacora]
fecha: 2026-10-18
---
# 2026-10-18 · Análisis inicial

## Qué se hizo
- Lectura completa del código (React + Vite, 3 commits de mayo 2024).
- `npm install` ✅ · `npm run build` ✅ · `npm run lint` ❌ 23 errores.
- Revisión del entorno: Node 26, Docker instalado (daemon apagado), sin `psql`.
- Creación de este vault con análisis, arquitectura propuesta, ADRs, roadmap y guía de diseño.

## Hallazgos clave
1. No hay backend ni BD; todo está hardcodeado en `Home.jsx`.
2. El "login" es solo un nombre en memoria; recargar = cerrar sesión.
3. El form de donaciones recarga la página (bug de `className` vs `action`).
4. Un selector CSS global (`section`) deforma toda la home.

## Pendiente
- Confirmar las propuestas (ADR-001 a 004) y arrancar la [[Roadmap#Fase 1 — Reorganizar el repo|Fase 1]].
