FROM node:alpine

WORKDIR /app/user

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

RUN sleep 10

CMD ["npm","start"]

