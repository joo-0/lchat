FROM node:10

RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]