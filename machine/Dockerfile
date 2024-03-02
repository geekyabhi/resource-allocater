FROM node:alpine

WORKDIR /app/user

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

CMD ["sh", "-c","\
    npm run grpc & \
    npm start\
"]
