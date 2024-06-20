# Usa una imagen base oficial de Node.js
FROM node:21-alpine3.19

# Instala las herramientas de cliente de PostgreSQL
RUN apk add --no-cache postgresql-client

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de npm y Prisma
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Genera el cliente Prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Expone el puerto que utiliza la aplicación NestJS
EXPOSE 3000


CMD ["sh", "-c", "until pg_isready -h db -p 5432; do echo 'Waiting for postgres...'; sleep 2; done && npx prisma db push --schema src/prisma/schema.prisma && npm run start:dev"]