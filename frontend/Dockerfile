FROM node:15.4.0

ADD . /app

WORKDIR /app

COPY package.json /app

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000
