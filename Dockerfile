FROM node:18-alpine

# Instal OpenSSL agar Prisma ORM bisa berjalan sempurna di Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]