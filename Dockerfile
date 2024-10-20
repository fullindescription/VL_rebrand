# Сборка react app в production
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Запуск прода в nginx
FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html

# COPY ./nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 80