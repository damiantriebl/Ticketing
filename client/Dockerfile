FROM node:alpine
RUN npm install -g npm@8.3.0
WORKDIR /app
COPY package.json .
RUN npm install 

COPY . .

CMD ["npm", "run", "dev"]