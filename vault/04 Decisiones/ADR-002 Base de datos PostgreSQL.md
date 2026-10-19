---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-002 · PostgreSQL con `pg` y SQL directo

**Decisión**
- PostgreSQL 16 levantado con **Docker Compose** (Docker ya está instalado en la máquina; no hay que instalar Postgres a mano).
- Librería **`pg`** con consultas SQL escritas en los modelos. Esquema en `database/schema.sql`, datos en `database/seed.sql`.

**Por qué SQL directo y no un ORM (Prisma/Sequelize)**: para un proyecto universitario se entiende mejor qué hace cada modelo, y el SQL se puede mostrar y defender en la sustentación. Menos "magia".

**Riesgo**: SQL injection si se concatenan strings → **siempre** consultas parametrizadas (`$1, $2`).
