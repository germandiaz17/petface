# Imagen de la API principal (servicio MVC). Se ejecutan varias réplicas de esta imagen.
FROM node:24-alpine
WORKDIR /app
COPY server/package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server/src ./src
EXPOSE 3000
CMD ["node", "src/server.js"]
