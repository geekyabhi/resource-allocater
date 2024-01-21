const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { DOCK_GRPC_HOST, DOCK_GRPC_PORT } = require('../config');
const { Readable } = require('stream');

const PROTO_PATH = path.join(__dirname, '../../dock.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});


class DockerService{
    constructor(){
        this.host = `${DOCK_GRPC_HOST}:${DOCK_GRPC_PORT}`
        this.dockerProto = grpc.loadPackageDefinition(packageDefinition).DockerService;
        this.client = new this.dockerProto(this.host,grpc.credentials.createInsecure())
        this.stopStreaming = false
        this.call = null
    }
    async streamContainerLogs(containerId , fn){
      const request = { container_id: containerId };
      this.call = this.client.StreamContainerLogs(request);

      const readableStream = new Readable({
        read() {},
      });

      this.call.on('data', (log) => {
        fn(log)
        readableStream.push(log.log_line);
        // console.log('Log:', log.log_line);
      });
    
      this.call.on('end', () => {
          readableStream.push(null);
          this.streamContainerLogs(containerId,fn);
      });
    
      this.call.on('error', (err) => {
        console.error('Error:', err);
      });
      return readableStream
      // await new Promise((resolve) => this.call.on('end', resolve));
    }

    stopStreamingLogs(){
      if (this.call) {
        this.call.cancel(); // Cancel the current streaming call
        this.call = null; // Reset the current streaming call
        console.log('Streaming stopped.');
      } else {
        console.log('No active streaming to stop.');
      }
    }
}

module.exports = {DockerService}
