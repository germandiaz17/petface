// Microservicio de notificaciones en Vercel: es OTRA función, separada de la API
// (se despliega y escala por su cuenta). vercel.json enruta /notif/* hacia aquí.
import app from '../notificaciones/src/app.js'

export default app
