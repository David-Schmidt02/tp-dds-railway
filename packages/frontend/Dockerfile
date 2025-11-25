FROM node:22-alpine

WORKDIR /app

# Copiamos los package.json del monorepo desde el contexto raíz
COPY package*.json ./

# Copiamos package.json del frontend
COPY packages/frontend/package*.json ./packages/frontend/

# Instalamos dependencias solo para frontend
RUN npm install --workspace=frontend

# Copiamos el código del frontend
COPY packages/frontend ./packages/frontend

# Variables de entorno de build
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

ARG REACT_APP_DEFAULT_USER_ID
ENV REACT_APP_DEFAULT_USER_ID=$REACT_APP_DEFAULT_USER_ID

EXPOSE 5200

WORKDIR /app/packages/frontend

# Ejecutamos el frontend
CMD ["npm", "start"]
