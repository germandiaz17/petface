---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-004 · Un repo con `client/` y `server/`

**Decisión**: mantener un solo repositorio con carpetas `client/` (React + Vite), `server/` (Express), `database/` (SQL) y `vault/` (este cerebro). Un `package.json` raíz con scripts para levantar todo (`concurrently`).

**Por qué**: fácil de clonar y entregar; todo el contexto en un solo lugar.

Estructura completa en [[Arquitectura propuesta]].
