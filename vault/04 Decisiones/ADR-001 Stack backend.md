---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-001 · Stack backend: Node + Express

**Contexto**: no hay backend. Se pide MVC, CRUD y BD. El equipo ya trabaja en JavaScript (React).

**Decisión**: API REST con **Node.js + Express**, en JavaScript (sin TypeScript), patrón MVC (models / controllers / routes).

**Alternativas**
- Express + EJS (MVC clásico renderizado en servidor): más "de libro", pero tiraría el React actual.
- NestJS: demasiada arquitectura para el alcance.
- Django/Laravel: otro lenguaje; reescritura total.

**Consecuencias**: un solo lenguaje en todo el proyecto; React actúa como la **Vista** del MVC.
