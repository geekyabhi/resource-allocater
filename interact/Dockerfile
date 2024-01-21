FROM node:alpine

WORKDIR /app/user

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5006

CMD ["npm","start"]

