FROM node:alpine

RUN npm install -g npm@8.1.4

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]