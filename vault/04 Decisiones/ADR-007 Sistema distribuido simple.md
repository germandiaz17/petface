---
tags: [adr]
estado: aceptada
fecha: 2026-10-18
---
# ADR-007 · Sistema distribuido: microservicio + gateway + réplicas (versión simple)

**Contexto**: el curso pide integrar sistemas distribuidos (varios servicios y contenedores con réplicas), en local y en Vercel. El equipo pidió **no complicarlo**: basta con poder demostrarlo.

**Decisión**
- Un **microservicio de notificaciones** independiente (su propio `package.json`, su propio MVC, dueño de la tabla `notificaciones`).
- La API le envía **eventos por HTTP** con tiempo límite de 2 s. Si falla, solo se registra un aviso: la operación principal nunca se cae (**tolerancia a fallos**).
- **Gateway Nginx** con **2 réplicas** de la API (*round robin*, failover con `max_fails`). Las réplicas comparten un volumen para las fotos.
- Autenticación compartida: ambos servicios validan el mismo JWT; la clave entre servicios se deriva de `JWT_SECRET` (HMAC), así no hay que configurar nada más.
- En **Vercel**: el microservicio es otra función (`api/notif.js`); `vercel.json` hace de gateway; Vercel escala cada función por separado.

**Descartado (por simplicidad)**: broker de mensajes (RabbitMQ/Kafka), patrón outbox con reintentos persistentes, base de datos separada por servicio, réplica de lectura de PostgreSQL, segundo proyecto de Vercel.

**Consecuencias / limitaciones conocidas**
- Si el microservicio está caído en el momento del evento, ese aviso se pierde (no hay reintentos). Aceptable: los avisos son informativos.
- Ambos servicios usan el mismo servidor PostgreSQL (cada uno solo toca sus tablas).
- Nginx usa un balanceo por proceso de trabajo, por eso el reparto no es perfectamente alterno.
