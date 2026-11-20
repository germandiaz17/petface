import pg from 'pg'
import { pool } from '../config/db.js'
import { INSTANCIA } from '../config/instancia.js'

// CRUD EN VIVO: cuando cambia la tabla "mascotas", todos los navegadores abiertos
// se enteran al instante, sin importar qué réplica hizo el cambio.
//
//   1. Un TRIGGER de PostgreSQL publica cada INSERT/UPDATE/DELETE en el canal "mascotas_cambios"
//      (NOTIFY). Incluye "origen": el nombre de la conexión que hizo el cambio
//      (api-1, api-2… o "psql" si fue a mano).
//   2. Cada réplica de la API escucha ese canal (LISTEN) con una conexión propia.
//   3. Cada réplica reenvía el aviso a los navegadores conectados a ella con
//      Server-Sent Events (GET /api/mascotas/eventos).
//
// La base de datos hace de "bus" de mensajes entre réplicas: no hace falta Redis ni RabbitMQ.

const CANAL = 'mascotas_cambios'

// Se instala al arrancar (como la tabla del microservicio): así funciona también con
// bases de datos creadas antes de esta función. El candado evita que dos réplicas
// lo instalen a la vez.
const SQL_TRIGGER = `
  SELECT pg_advisory_xact_lock(hashtext('petface_trigger_mascotas'));

  CREATE OR REPLACE FUNCTION avisar_cambio_mascota() RETURNS trigger AS $$
  DECLARE
    fila mascotas%ROWTYPE;
  BEGIN
    IF TG_OP = 'DELETE' THEN fila := OLD; ELSE fila := NEW; END IF;
    PERFORM pg_notify('${CANAL}', json_build_object(
      'operacion', TG_OP,
      'id', fila.id,
      'nombre', fila.nombre,
      'estado', fila.estado,
      'origen', current_setting('application_name')
    )::text);
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

  CREATE OR REPLACE TRIGGER mascotas_avisar_cambio
    AFTER INSERT OR UPDATE OR DELETE ON mascotas
    FOR EACH ROW EXECUTE FUNCTION avisar_cambio_mascota();
`

// En Vercel las funciones no mantienen conexiones abiertas: ahí no hay tiempo real
export const disponible = !process.env.VERCEL

const navegadores = new Set() // respuestas SSE abiertas en ESTA réplica
let escucha = null // promesa de la conexión que hace LISTEN

function enviar(res, evento, datos) {
  res.write(`event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`)
}

function difundir(cambio) {
  const datos = { ...cambio, entregadoPor: INSTANCIA }
  for (const res of navegadores) enviar(res, 'cambio', datos)
}

async function conectar() {
  const client = new pg.Client(pool.options) // misma configuración que el pool, conexión aparte
  let caida = false
  const alCaer = (err) => {
    if (caida) return
    caida = true
    console.warn(`[tiempo real] se perdió la conexión de escucha (${err?.message ?? 'cerrada'})`)
    escucha = null
    client.end().catch(() => {})
    // Reintenta si todavía hay navegadores esperando avisos
    setTimeout(() => navegadores.size && iniciar().catch(() => {}), 2000)
  }
  client.on('error', alCaer)
  client.on('end', alCaer)
  client.on('notification', (msg) => difundir(JSON.parse(msg.payload)))

  await client.connect()
  await client.query('BEGIN')
  await client.query(SQL_TRIGGER)
  await client.query('COMMIT')
  await client.query(`LISTEN ${CANAL}`)
  console.log(`[tiempo real] ${INSTANCIA} escuchando cambios de mascotas`)
  return client
}

// Se conecta una sola vez, con el primer navegador que se suscribe
export function iniciar() {
  escucha ??= conectar().catch((err) => {
    escucha = null
    throw err
  })
  return escucha
}

// Registra un navegador. Devuelve la función para darlo de baja.
export function suscribir(res) {
  navegadores.add(res)
  enviar(res, 'conectado', { instancia: INSTANCIA })
  // Un comentario cada 25 s evita que el gateway corte la conexión por inactividad
  const latido = setInterval(() => res.write(': latido\n\n'), 25_000)
  return () => {
    clearInterval(latido)
    navegadores.delete(res)
  }
}
