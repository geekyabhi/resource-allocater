const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { VERIFIRE_GRPC_HOST ,VERIFIRE_GRPC_PORT} = require('../../../../config');

const PROTO_PATH = './src/proto/allocation.proto'; // Path to your .proto file

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});


const allocation_proto = grpc.loadPackageDefinition(packageDefinition).allocation;

const verifire_grpc_host = VERIFIRE_GRPC_HOST;
const verifire_grpc_port = VERIFIRE_GRPC_PORT;

class AllocationService {
  constructor() {
    this.channel = new grpc.Client(verifire_grpc_host + ':' + verifire_grpc_port, grpc.credentials.createInsecure());
    this.stub = new allocation_proto.AllocationService(verifire_grpc_host + ':' + verifire_grpc_port, grpc.credentials.createInsecure());
  }
  
  async getAllocationByContainerId(allocationData) {
    const request = {
      data: typeof allocationData === 'object' ? JSON.stringify(allocationData) : allocationData
    };

    try {
      const response = await new Promise((resolve, reject) => {
        this.stub.GetAllocationData(request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
      if(!response.data){
        return {}
      }
      const responseData = JSON.parse(response.data);
      const allocation = {
        container_id : responseData.ContainerId,
        container_name : responseData.ContainerName,
        is_active : responseData.IsActive,
        machine_id : responseData.MachineId,
        port_user : responseData.PortUsed,
        status : responseData.Status,
        uid : responseData.Uid,
      };
      return allocation;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

module.exports = {AllocationService}