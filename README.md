# 🐾 PetFace

Plataforma web de **adopción de mascotas** — proyecto universitario.

- **Frontend** (`client/`): React 18 + Vite
- **Backend** (`server/`): Node.js + Express, patrón **MVC**
- **Base de datos** (`database/`): PostgreSQL 16 en Docker
- **Documentación** (`vault/`): vault de Obsidian con análisis, arquitectura, decisiones y roadmap. Empieza por `vault/00 - Inicio.md`.

## Requisitos
- Node.js 22 o superior
- Docker con Docker Compose

## Puesta en marcha
```bash
npm install                         # instala client y server (npm workspaces)
cp server/.env.example server/.env  # variables de entorno del backend
npm run db:up                       # levanta PostgreSQL (crea tablas y datos de prueba)
npm run dev                         # API en :3000 y web en :5173
```
Abre http://localhost:5173. Para comprobar la API y la BD: http://localhost:5173/api/health

## Scripts
| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta backend y frontend a la vez |
| `npm run dev:client` / `dev:server` | Solo uno de los dos |
| `npm run build` | Compila el frontend |
| `npm run lint` | Revisa el código del frontend |
| `npm run db:up` / `db:down` | Enciende / apaga PostgreSQL |
| `npm run db:reset` | **Borra** la BD y la recrea desde `database/*.sql` |
| `npm run db:psql` | Consola SQL dentro del contenedor |

## Estructura
```
client/            React (la VISTA del MVC)
server/src/
  config/          conexión a PostgreSQL
  models/          MODELO: consultas SQL
  controllers/     CONTROLADOR: lógica de cada petición
  routes/          URL → controlador
  middlewares/     errores, autenticación…
database/          schema.sql y seed.sql
vault/             documentación (Obsidian)
```

## Usuarios de prueba
| Email | Contraseña | Rol |
|---|---|---|
| admin@petface.com | admin123 | admin |
| ana@petface.com | ana12345 | adoptante |

(El login real llega en la Fase 3 del roadmap.)
