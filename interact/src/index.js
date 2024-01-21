const {DockerService} = require('./docker_service_communication/grpc_communication')
const WebSocket = require('ws');
require('colors')

const http = require('http');
const express = require('express');
const { PORT } = require('./config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection',(ws)=>{
    console.log("Client connected")
    ws.on('message',async(message)=>{
        try{
            const data = JSON.parse(message);
            const {event , containerId} = data
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