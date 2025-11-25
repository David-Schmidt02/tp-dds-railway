FROM node:22-alpine

WORKDIR /app

# Copiamos los package.json del monorepo desde el contexto raíz
COPY package*.json ./

# Copiamos package.json del backend
COPY packages/backend/package*.json ./packages/backend/

# Instalamos dependencias solo para backend
RUN npm install --workspace=backend --production

# Copiamos el código del backend
COPY packages/backend ./packages/backend

EXPOSE 4000

# Ejecutamos backend desde el workspace correcto
CMD ["npm", "run", "start", "--workspace=backend"]