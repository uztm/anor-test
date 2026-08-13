FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm set strict-ssl false
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.29-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY --from=builder /app/infrastructure/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
