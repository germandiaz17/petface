# Gateway: compila la web de React y la sirve con Nginx, que además
# enruta /api (con balanceo entre réplicas) y /notif hacia los servicios.
FROM node:24-alpine AS web
WORKDIR /app
COPY client/package.json ./
RUN npm install --no-audit --no-fund
COPY client/ ./
RUN npm run build

FROM nginx:1.27-alpine
COPY gateway/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web /app/dist /usr/share/nginx/html
