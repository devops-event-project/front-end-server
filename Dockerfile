FROM node:14-alpine
RUN mkdir -p /front-end-server/src
WORKDIR /front-end-server/src

RUN npm install
COPY . /front-end-server/src
EXPOSE 3000

CMD ["node", "server.js"]