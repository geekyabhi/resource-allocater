// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var dock_pb = require('./dock_pb.js');

function serialize_ContainerDataRequest(arg) {
  if (!(arg instanceof dock_pb.ContainerDataRequest)) {
    throw new Error('Expected argument of type ContainerDataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ContainerDataRequest(buffer_arg) {
  return dock_pb.ContainerDataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ContainerDataResponse(arg) {
  if (!(arg instanceof dock_pb.ContainerDataResponse)) {
    throw new Error('Expected argument of type ContainerDataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ContainerDataResponse(buffer_arg) {
  return dock_pb.ContainerDataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ContainerIDRequest(arg) {
  if (!(arg instanceof dock_pb.ContainerIDRequest)) {
    throw new Error('Expected argument of type ContainerIDRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ContainerIDRequest(buffer_arg) {
  return dock_pb.ContainerIDRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Log(arg) {
  if (!(arg instanceof dock_pb.Log)) {
    throw new Error('Expected argument of type Log');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Log(buffer_arg) {
  return dock_pb.Log.deserializeBinary(new Uint8Array(buffer_arg));
}


var DockerServiceService = exports.DockerServiceService = {
  runContainer: {
    path: '/DockerService/RunContainer',
    requestStream: false,
    responseStream: false,
    requestType: dock_pb.ContainerDataRequest,
    responseType: dock_pb.ContainerDataResponse,
    requestSerialize: serialize_ContainerDataRequest,
    requestDeserialize: deserialize_ContainerDataRequest,
    responseSerialize: serialize_ContainerDataResponse,
    responseDeserialize: deserialize_ContainerDataResponse,
  },
  startContainer: {
    path: '/DockerService/StartContainer',
    requestStream: false,
    responseStream: false,
    requestType: dock_pb.ContainerIDRequest,
    responseType: dock_pb.ContainerDataResponse,
    requestSerialize: serialize_ContainerIDRequest,
    requestDeserialize: deserialize_ContainerIDRequest,
    responseSerialize: serialize_ContainerDataResponse,
    responseDeserialize: deserialize_ContainerDataResponse,
  },
  stopContainer: {
    path: '/DockerService/StopContainer',
    requestStream: false,
    responseStream: false,
    requestType: dock_pb.ContainerIDRequest,
    responseType: dock_pb.ContainerDataResponse,
    requestSerialize: serialize_ContainerIDRequest,
    requestDeserialize: deserialize_ContainerIDRequest,
    responseSerialize: serialize_ContainerDataResponse,
    responseDeserialize: deserialize_ContainerDataResponse,
  },
  inspectContainer: {
    path: '/DockerService/InspectContainer',
    requestStream: false,
    responseStream: false,
    requestType: dock_pb.ContainerIDRequest,
    responseType: dock_pb.ContainerDataResponse,
    requestSerialize: serialize_ContainerIDRequest,
    requestDeserialize: deserialize_ContainerIDRequest,
    responseSerialize: serialize_ContainerDataResponse,
    responseDeserialize: deserialize_ContainerDataResponse,
  },
  removeContainer: {
    path: '/DockerService/RemoveContainer',
    requestStream: false,
    responseStream: false,
    requestType: dock_pb.ContainerIDRequest,
    responseType: dock_pb.ContainerDataResponse,
    requestSerialize: serialize_ContainerIDRequest,
    requestDeserialize: deserialize_ContainerIDRequest,
    responseSerialize: serialize_ContainerDataResponse,
    responseDeserialize: deserialize_ContainerDataResponse,
  },
  streamContainerLogs: {
    path: '/DockerService/StreamContainerLogs',
    requestStream: false,
    responseStream: true,
    requestType: dock_pb.ContainerIDRequest,
    responseType: dock_pb.Log,
    requestSerialize: serialize_ContainerIDRequest,
    requestDeserialize: deserialize_ContainerIDRequest,
    responseSerialize: serialize_Log,
    responseDeserialize: deserialize_Log,
  },
};

exports.DockerServiceClient = grpc.makeGenericClientConstructor(DockerServiceService);
