-- PetFace · Esquema de la base de datos
-- Ver vault/02 Arquitectura/Modelo de datos.md

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para crypt()/gen_salt() en el seed

DROP TABLE IF EXISTS testimonios, donaciones, solicitudes, mascotas, usuarios CASCADE;

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono      VARCHAR(30),
  rol           VARCHAR(20)  NOT NULL DEFAULT 'adoptante'
                CHECK (rol IN ('admin', 'adoptante')),
  creado_en     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE mascotas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(80)  NOT NULL,
  especie     VARCHAR(20)  NOT NULL CHECK (especie IN ('perro', 'gato', 'otro')),
  raza        VARCHAR(80),
  edad_meses  INTEGER      CHECK (edad_meses >= 0),
  genero      VARCHAR(10)  NOT NULL CHECK (genero IN ('macho', 'hembra')),
  tamano      VARCHAR(10)  CHECK (tamano IN ('pequeño', 'mediano', 'grande')),
  descripcion TEXT,
  foto_url    VARCHAR(255),
  estado      VARCHAR(20)  NOT NULL DEFAULT 'disponible'
              CHECK (estado IN ('disponible', 'en_proceso', 'adoptada')),
  creado_en   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE solicitudes (
  id                SERIAL PRIMARY KEY,
  usuario_id        INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mascota_id        INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
  mensaje           TEXT,
  telefono_contacto VARCHAR(30),
  estado            VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  creado_en         TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Un usuario no puede tener dos solicitudes pendientes para la misma mascota
CREATE UNIQUE INDEX solicitudes_pendiente_unica
  ON solicitudes (usuario_id, mascota_id)
  WHERE estado = 'pendiente';

CREATE TABLE donaciones (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre     VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  monto      NUMERIC(10,2) NOT NULL CHECK (monto > 0),
  creado_en  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonios (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  autor      VARCHAR(100) NOT NULL,
  texto      TEXT         NOT NULL,
  aprobado   BOOLEAN      NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMP    NOT NULL DEFAULT NOW()
);
