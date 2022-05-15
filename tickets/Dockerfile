FROM node:alpine
RUN npm install -g npm@8.5.1
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]