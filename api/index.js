// Punto de entrada de la API en Vercel: la app de Express funciona como función serverless.
// vercel.json redirige /api/* y /uploads/* a esta función; Express ve la URL original.
import app from '../server/src/app.js'

export default app
