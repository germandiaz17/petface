import app from './app.js'

const PORT = process.env.NOTIF_PORT ?? 3001

app.listen(PORT, () => {
  console.log(`Microservicio de notificaciones en http://localhost:${PORT}/notif`)
})
