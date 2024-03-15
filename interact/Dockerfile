FROM node:alpine

WORKDIR /app/user

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5006

CMD ["sh", "-c","\
    npm run grpc_docker & \
    npm run grpc_user & \
    npm run grpc_allocation & \
    npm start\
"]
