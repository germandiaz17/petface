---
tags: [presentacion]
actualizado: 2026-10-18
---
# Resumen del proyecto PetFace

**PetFace** es una plataforma web de adopción de mascotas: las personas conocen a los animales disponibles, solicitan adoptarlos y donan; el equipo administra el catálogo y decide las adopciones.

- **En línea:** https://petface.vercel.app
- **Stack:** React (vista) · Node.js + Express (modelo y controlador) · PostgreSQL · Docker · Vercel + Neon

## 1. Funcionalidades

### Visitante (sin cuenta)
- Ver el **catálogo** con búsqueda por nombre/raza y filtros (especie, género, tamaño, estado).
- Ver la **ficha** de cada mascota (fotos, edad, tamaño, descripción, estado).
- **Donar** (simulado, sin cobro real).
- Leer **testimonios** de familias que adoptaron.
- **Registrarse** e **iniciar sesión**.

### Adoptante (con cuenta)
- **Solicitar la adopción** de una mascota (teléfono + mensaje).
- **Mi perfil**: ver sus solicitudes (pendiente / aprobada / rechazada) y cancelar las pendientes.
- **Escribir un testimonio** (queda pendiente de aprobación).
- **Campana 🔔** con avisos: "tu solicitud fue aprobada", etc.

### Administrador
- **Resumen** con contadores (solicitudes pendientes, mascotas por estado, total donado).
- **CRUD de mascotas**: crear, ver, editar y eliminar, con **subida de fotos**.
- **Solicitudes**: aprobar o rechazar. Al aprobar, la mascota queda *adoptada* y las demás solicitudes por ella se rechazan solas.
- **Testimonios**: publicar, ocultar o eliminar.
- **Donaciones**: listado y total.
- **Sistema distribuido**: tarjeta que muestra qué réplica atiende cada petición y si el microservicio está vivo.
- Campana con avisos de nuevas solicitudes, donaciones y testimonios.

### Transversal
- Sesión que se mantiene al recargar; roles admin/adoptante.
- Diseño responsive (móvil y escritorio).
- 24 pruebas automáticas (`npm test`).

## 2. MVC: cómo está aplicado y por qué

| Capa | Dónde está | Responsabilidad |
|---|---|---|
| **Modelo** | `server/src/models/` | Hablar con la base de datos: consultas SQL y reglas de datos (p. ej. la transacción de aprobar una adopción) |
| **Vista** | `client/` (React) | Mostrar la información y capturar lo que hace el usuario |
| **Controlador** | `server/src/controllers/` | Recibir la petición, validar los datos, llamar al modelo y responder |
| Rutas | `server/src/routes/` | Asociar cada URL + método a un controlador |
| Middlewares | `server/src/middlewares/` | Tareas comunes: verificar sesión/rol, subir archivos, manejar errores |

### Ejemplo real: el admin aprueba una solicitud
1. **Vista** — `AdminSolicitudes.jsx`: el admin pulsa *Aprobar* → `PATCH /api/solicitudes/5`.
2. **Ruta** — `solicitudes.routes.js`: `router.patch('/:id', requireAdmin, ctrl.cambiarEstado)`.
3. **Middleware** — `requireAdmin`: si no es admin, responde 403 y no sigue.
4. **Controlador** — `solicitudes.controller.js`: valida que el estado sea `aprobada` o `rechazada` y llama al modelo.
5. **Modelo** — `solicitud.model.js`: en una transacción actualiza la solicitud, marca la mascota como adoptada y rechaza las demás.
6. **Vista**: muestra "¡Adopción aprobada!".

### Por qué MVC
- **Separación de responsabilidades**: cada archivo hace una sola cosa; cambiar el diseño no toca el SQL y viceversa.
- **Mantenible y probable**: los modelos y controladores se prueban por separado (24 pruebas).
- **La vista es intercambiable**: el backend expone una API REST; podría tener una app móvil como segunda vista sin cambiar nada del servidor.
- **Escala**: el mismo patrón se repite en el microservicio de notificaciones (tiene sus propios `models/`, `controllers/`, `routes/`).

## 3. Sistemas distribuidos: qué hay y por qué

```
Navegador → Gateway (Nginx, balanceo de carga)
              ├─ /       → Web (React)
              ├─ /api    → API réplica 1 ┐→ PostgreSQL
              │          → API réplica 2 ┘   │ eventos HTTP
              └─ /notif  → Microservicio de notificaciones → PostgreSQL
```

| Elemento | Qué hace | Concepto que demuestra |
|---|---|---|
| **Microservicio de notificaciones** | Servicio independiente que crea y entrega los avisos | Arquitectura de **microservicios**: servicios separados que se comunican por red |
| **Eventos de la API al microservicio** | La API avisa "se aprobó una solicitud" por HTTP; el microservicio decide qué notificar | **Comunicación entre servicios** y bajo acoplamiento |
| **Tiempo límite de 2 s** | Si el microservicio no responde, la API sigue igual | **Tolerancia a fallos** |
| **Gateway Nginx** | Única entrada; envía cada URL al servicio correcto | **API Gateway** y **balanceo de carga** |
| **2 réplicas de la API** | Dos copias idénticas atendiendo a la vez | **Escalado horizontal** y **alta disponibilidad** |
| **JWT compartido** | Ambos servicios validan la misma sesión sin consultarse | **Autenticación distribuida**, servicios sin estado |
| **Docker Compose** | 5 contenedores con un comando | **Contenedores** y despliegue reproducible |
| **Vercel** | API y microservicio como funciones separadas que escalan solas | **Escalado automático en la nube** |

### Por qué así
- Las notificaciones son **independientes** del negocio principal: si fallan, adoptar y donar debe seguir funcionando → candidato natural a microservicio.
- La API **no guarda sesiones en memoria** (usa JWT), por eso **cualquier réplica** puede atender a cualquier usuario.
- Se eligió **HTTP con tiempo límite** en lugar de RabbitMQ/Kafka para mantenerlo simple y que funcione igual en Docker y en Vercel (Vercel no permite procesos siempre encendidos). Ver [[ADR-007 Sistema distribuido simple]].

### Cómo demostrarlo (2 minutos)
1. `npm run distribuido` → http://localhost:8080
2. *Admin → Resumen → Probar balanceo* → se alternan `api-1` y `api-2`.
3. Ana solicita una mascota → la campana del admin muestra el aviso (lo creó el microservicio).
4. `docker stop petface-api-1 petface-notificaciones` → todo lo atiende `api-2`, el microservicio aparece "sin respuesta" y la app sigue funcionando.
5. En producción: decenas de instancias de la API se encienden solas con tráfico simultáneo.

## 4. Cuentas de prueba
| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@petface.com | admin123 |
| Adoptante | ana@petface.com | ana12345 |
| Adoptante | carlos@petface.com | carlos123 |

Guion completo y preguntas probables: [[Guía de sustentación]].
