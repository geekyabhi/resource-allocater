const WebSocket = require('ws');
require('colors')

const http = require('http');
const express = require('express');
const { PORT } = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const {DockerService} = require('./microservice_comm/grpc_comm/docker_service/')
const {UserService} = require('./microservice_comm/grpc_comm/verifire/user');
const {AllocationService} =require('./microservice_comm/grpc_comm/verifire/allocation')
const { ValidateSignature } = require('./utils/functions');
const us = new UserService()
const as = new AllocationService()

wss.on('connection',(ws)=>{
    console.log("Client connected")
    ws.on('message',async(message)=>{
        try{
            const data = JSON.parse(message);
            const {event , containerId, token} = data
            const payload = await ValidateSignature(token)
            const user_data = await us.getUser(payload.id)
            const allocation_data = await as.getAllocationByContainerId(containerId)
            if(user_data?.id && allocation_data?.uid && String(allocation_data.uid) != String(user_data.id) && user_data?.admin!=true){
                throw new Error("No such instance exist")
            }
            switch (event) {
                case "SEND_LOGS":
                    const ds = new DockerService()
                    ds.streamContainerLogs(containerId,(log)=>{
                        ws.send(log.log_line)
                    })
                    break;
                
                case "CLOSE_LOGS":
                    ws.send("Closing connection")
                    ws.close()
                    break;
            
                default:
                    break;
            }
        }catch(e){
            console.log(e)
            ws.send(String(e))
            ws.close()
        }
    })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`.yellow);
});