# Front/my-front/Dockerfile
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.2.3

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "start"]
