# Etapa de build do frontend
FROM node:18 as build-frontend
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm install

# Etapa de build do backend
FROM node:18 as build-backend
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
RUN npm run build
RUN node ./src/swaggerAutogen.js

# Etapa de produção
FROM node:18-slim
WORKDIR /app

ENV NODE_ENV=production

# Copia os artefatos do build do frontend para a pasta pública do backend
COPY --from=build-frontend /app/dist/spa /app/public

# Copia os artefatos do build do backend
COPY --from=build-backend /app/dist /app

# Instala apenas as dependências de produção
COPY backend/package*.json ./
RUN npm install --only=production

EXPOSE 3000
CMD [ "node", "app.js" ]
