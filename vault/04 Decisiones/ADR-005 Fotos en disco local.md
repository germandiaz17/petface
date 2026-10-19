---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-005 · Fotos subidas en disco local

**Contexto**: el admin necesita subir fotos de mascotas (Fase 5).

**Decisión**: guardarlas en `server/uploads/` con **multer** y servirlas con `express.static` en `/uploads`. La base de datos guarda solo la URL (`foto_url`).

**Alternativas**: guardar la imagen dentro de PostgreSQL (`BYTEA`), que hace pesada la BD; o un servicio en la nube (S3, Cloudinary), que necesita cuentas y llaves, demasiado para el alcance.

**Consecuencias**: simple y sin servicios externos. Las fotos no viajan con el repositorio (están en `.gitignore`): en otra máquina solo existen las fotos de ejemplo de `client/public/img/mascotas/`. Al reemplazar o borrar la foto de una mascota se elimina el archivo viejo.
