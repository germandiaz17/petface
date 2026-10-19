---
tags: [presentacion]
actualizado: 2026-10-18
---
# Guía de sustentación

## Checklist antes de presentar
- [ ] Docker encendido: `sudo systemctl start docker`
- [ ] Datos limpios: `npm run db:reset` (deja 3 usuarios, 4 mascotas, 2 solicitudes pendientes para Max, 3 donaciones, 1 testimonio por revisar)
- [ ] `npm test` en verde (17 pruebas)
- [ ] `npm run dev` y abrir http://localhost:5173
- [ ] Dos ventanas del navegador: una normal (adoptante) y otra en incógnito (admin), para mostrar ambos lados sin cerrar sesión
- [ ] Tener a mano una foto de mascota para subirla en vivo

## Guion de la demo (≈ 7 minutos)
1. **El problema** (30 s): los refugios necesitan dar visibilidad a sus animales y gestionar adopciones de forma ordenada.
2. **Sitio público** (1 min): inicio → catálogo → filtrar por "Gato" → buscar "golden" → abrir la ficha de Bella.
3. **Adoptante** (1,5 min): "Iniciar sesión para adoptar" → entrar como `ana@petface.com` → vuelve a la ficha → enviar solicitud → Mi perfil muestra "Pendiente".
4. **Admin** (2 min, ventana incógnito, `admin@petface.com`):
   - Resumen: solicitudes pendientes destacadas.
   - Solicitudes: hay **dos** personas pidiendo a Max → aprobar la de Ana → explicar que la de Carlos se rechaza sola y Max queda "Adoptada" (todo en una **transacción**).
   - Mascotas: crear una nueva **subiendo una foto** → aparece en el catálogo público.
5. **Volver al adoptante** (30 s): recargar Mi perfil → la solicitud ahora dice "Aprobada".
6. **Móvil** (30 s): herramientas de desarrollador → vista móvil → menú hamburguesa y tablas convertidas en tarjetas.
7. **Código** (1 min): mostrar el recorrido MVC (abajo) y `npm test`.

## Cómo explicar el MVC con un ejemplo real
Petición: el admin aprueba una solicitud → `PATCH /api/solicitudes/5 { estado: 'aprobada' }`

| Paso | Archivo | Qué hace |
|---|---|---|
| Ruta | `server/src/routes/solicitudes.routes.js` | `router.patch('/:id', requireAdmin, ctrl.cambiarEstado)` |
| Middleware | `server/src/middlewares/auth.js` | `requireAdmin`: 401 sin sesión, 403 si no es admin |
| **Controlador** | `server/src/controllers/solicitudes.controller.js` | Valida que `estado` sea `aprobada` o `rechazada` y llama al modelo |
| **Modelo** | `server/src/models/solicitud.model.js` | `BEGIN` → actualiza la solicitud → mascota `adoptada` → rechaza las demás → `COMMIT` |
| **Vista** | `client/src/pages/admin/AdminSolicitudes.jsx` | Botón "Aprobar" → diálogo de confirmación → aviso "¡Adopción aprobada!" |

## Preguntas probables
**¿Dónde está la Vista si el backend solo devuelve JSON?**
La Vista es la aplicación React (`client/`). El backend expone Modelo y Controlador como API REST. Es MVC con la vista separada en el cliente, la forma habitual en aplicaciones web modernas. Ver [[ADR-001 Stack backend]].

**¿Por qué SQL directo y no un ORM?**
Para entender y poder explicar cada consulta. Todas son parametrizadas (`$1`), lo que evita la inyección SQL. Ver [[ADR-002 Base de datos PostgreSQL]].

**¿Cómo se guardan las contraseñas?**
Con bcrypt (hash + sal); nunca en texto plano y nunca se devuelven al cliente. El login usa el mismo mensaje para email o contraseña incorrectos y se bloquea tras 5 intentos fallidos.

**¿Cómo funciona la sesión?**
Al iniciar sesión, el servidor firma un JWT y lo guarda en una cookie `httpOnly`. El navegador la envía sola en cada petición; JavaScript no puede leerla, lo que protege contra robo por XSS. Al recargar, React pregunta `GET /api/auth/me`. Ver [[Autenticación]].

**¿Qué pasa si dos admins aprueban a la vez solicitudes de la misma mascota?**
El modelo usa una transacción con `SELECT ... FOR UPDATE`: la segunda espera a la primera y luego ve que la solicitud ya no está pendiente (responde 409).

**¿Qué impide que un usuario normal use la API de admin directamente?**
Los permisos se comprueban en el **backend** (`requireAdmin`), no solo ocultando botones. Hay pruebas automáticas que lo verifican (403).

**¿Cómo se valida que una foto subida es una imagen?**
Por tipo declarado, tamaño (5 MB) y los primeros bytes del archivo (firma JPG/PNG/WEBP). El nombre se genera al azar.

**¿Cómo lo probaron?**
17 pruebas automáticas de la API (`npm test`) contra la base de datos real, más pruebas manuales en el navegador de cada flujo en escritorio y móvil (ver bitácoras).

**¿Qué mejorarían con más tiempo?**
Pagos reales (pasarela), recuperación de contraseña por email, notificaciones al aprobar, paginación del catálogo, despliegue en la nube.
