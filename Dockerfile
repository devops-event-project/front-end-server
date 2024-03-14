FROM node:14-alpine
RUN mkdir -p /front-end-server
WORKDIR /front-end-server

COPY . /front-end-server
RUN npm install
EXPOSE 3000

CMD ["node", "server.js"]