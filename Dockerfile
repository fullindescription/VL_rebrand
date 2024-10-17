FROM node:latest

LABEL authors="momen"

WORKDIR app/

COPY dist .

RUN npm install -g serve

# Запускаем serve
CMD ["serve", "-s", "."]