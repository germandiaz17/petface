---
tags: [presentacion]
actualizado: 2026-10-18
---
# Guía de sustentación

## Checklist antes de presentar
- [ ] Docker encendido: `sudo systemctl start docker`
- [ ] Datos limpios: `npm run db:reset` (deja 3 usuarios, 4 mascotas, 2 solicitudes pendientes para Max, 3 donaciones, 1 testimonio por revisar)
- [ ] `npm test` en verde (24 pruebas: 19 de la API + 5 del microservicio)
- [ ] Para la parte distribuida: `npm run distribuido` → http://localhost:8080
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

## Sistema distribuido (demo de 2 minutos)
Antes: `npm run distribuido` y abrir **http://localhost:8080** (no el 5173).
1. **Arquitectura**: mostrar el diagrama del README: gateway → 2 réplicas de la API + microservicio de notificaciones.
2. **Balanceo de carga**: *Admin → Resumen → Probar balanceo* → las peticiones se reparten entre `api-1` y `api-2`.
3. **Comunicación entre servicios**: en otra ventana, Ana solicita adoptar a una mascota → la campana 🔔 del admin muestra el aviso. Explicar: la API no guarda notificaciones; le *avisa* al microservicio por HTTP y él decide qué notificar.
4. **Tolerancia a fallos**: en la terminal `docker stop petface-api-1 petface-notificaciones` → *Probar balanceo* muestra solo `api-2` y el microservicio "sin respuesta", pero se puede seguir donando y adoptando. Luego `docker start petface-api-1 petface-notificaciones`.
5. **MVC + distribuido**: cada servicio es MVC por dentro (mostrar `notificaciones/src/models`, `controllers`, `routes`); la distribución está *entre* servicios.

**Preguntas probables**
- *¿Por qué no RabbitMQ?* Para mantenerlo simple y que funcione igual en Vercel (que no permite procesos siempre encendidos). Con HTTP + tiempo límite ya se demuestra comunicación entre servicios y tolerancia a fallos.
- *¿Cómo sabe el microservicio quién es el usuario?* Valida el mismo JWT que emite la API; no necesita preguntarle a nadie.
- *¿Por qué cualquier réplica puede atender a cualquier usuario?* Porque la API no guarda sesiones en memoria: la sesión viaja en el JWT (servicios *stateless*).
- *¿Qué se pierde si el microservicio está caído?* Solo el aviso de ese momento; la operación principal se completa.

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
