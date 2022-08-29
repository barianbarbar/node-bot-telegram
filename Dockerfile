FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD ["node", "app.js", "bot-telegram.js"]

EXPOSE 3000
