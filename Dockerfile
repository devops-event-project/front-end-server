FROM node:14-alpine
RUN mkdir -p /front-end-server
WORKDIR /front-end-server

RUN npm install
COPY . /front-end-server
EXPOSE 3000

CMD ["node", "src/server.js"]