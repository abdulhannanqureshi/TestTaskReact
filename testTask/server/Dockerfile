FROM node:14
WORKDIR /usr/src/server

COPY ./ ./
COPY package*.json ./
RUN npm install

EXPOSE 8000
ENV NODE_ENV=production

CMD [ "npm", "start" ]
