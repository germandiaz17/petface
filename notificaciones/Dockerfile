# Imagen del microservicio de notificaciones
FROM node:24-alpine
WORKDIR /app
COPY notificaciones/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY notificaciones/src ./src
EXPOSE 3001
CMD ["node", "src/server.js"]
