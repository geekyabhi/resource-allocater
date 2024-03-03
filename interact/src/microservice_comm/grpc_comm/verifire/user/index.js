const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { VERIFIRE_GRPC_HOST ,VERIFIRE_GRPC_PORT} = require('../../../../config');

const PROTO_PATH = './user.proto'; // Path to your .proto file

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});


const user_proto = grpc.loadPackageDefinition(packageDefinition).user;

const verifire_grpc_host = VERIFIRE_GRPC_HOST;
const verifire_grpc_port = VERIFIRE_GRPC_PORT;

class UserService {
  constructor() {
    this.channel = new grpc.Client(verifire_grpc_host + ':' + verifire_grpc_port, grpc.credentials.createInsecure());
    this.stub = new user_proto.UserService(verifire_grpc_host + ':' + verifire_grpc_port, grpc.credentials.createInsecure());
  }
  
  async getUser(userData) {
    const request = {
      data: typeof userData === 'object' ? JSON.stringify(userData) : userData
    };

    try {
      const response = await new Promise((resolve, reject) => {
        this.stub.GetUserData(request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
      const responseData = JSON.parse(response.data);
      const user = {
        admin: responseData.Admin,
        email: responseData.Email,
        email_notification: responseData.EmailNotification,
        first_name: responseData.FirstName,
        gender: responseData.Gender,
        id: responseData.Id,
        last_name: responseData.LastName,
        password: responseData.Password,
        phone_number: responseData.PhoneNumber,
        salt: responseData.Salt,
        sms_notification: responseData.SmsNotification,
        verified: responseData.Verified
      };
      return user;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

module.exports = {UserService}