// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package allocation

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AllocationServiceClient is the client API for AllocationService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AllocationServiceClient interface {
	GetAllocationData(ctx context.Context, in *AllocationRequestData, opts ...grpc.CallOption) (*AllocationResponseData, error)
	GetAllAllocationData(ctx context.Context, in *AllocationRequestData, opts ...grpc.CallOption) (*AllAllocationResponseData, error)
}

type allocationServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewAllocationServiceClient(cc grpc.ClientConnInterface) AllocationServiceClient {
	return &allocationServiceClient{cc}
}

func (c *allocationServiceClient) GetAllocationData(ctx context.Context, in *AllocationRequestData, opts ...grpc.CallOption) (*AllocationResponseData, error) {
	out := new(AllocationResponseData)
	err := c.cc.Invoke(ctx, "/allocation.AllocationService/GetAllocationData", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *allocationServiceClient) GetAllAllocationData(ctx context.Context, in *AllocationRequestData, opts ...grpc.CallOption) (*AllAllocationResponseData, error) {
	out := new(AllAllocationResponseData)
	err := c.cc.Invoke(ctx, "/allocation.AllocationService/GetAllAllocationData", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AllocationServiceServer is the server API for AllocationService service.
// All implementations must embed UnimplementedAllocationServiceServer
// for forward compatibility
type AllocationServiceServer interface {
	GetAllocationData(context.Context, *AllocationRequestData) (*AllocationResponseData, error)
	GetAllAllocationData(context.Context, *AllocationRequestData) (*AllAllocationResponseData, error)
	mustEmbedUnimplementedAllocationServiceServer()
}

// UnimplementedAllocationServiceServer must be embedded to have forward compatible implementations.
type UnimplementedAllocationServiceServer struct {
}

func (UnimplementedAllocationServiceServer) GetAllocationData(context.Context, *AllocationRequestData) (*AllocationResponseData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAllocationData not implemented")
}
func (UnimplementedAllocationServiceServer) GetAllAllocationData(context.Context, *AllocationRequestData) (*AllAllocationResponseData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAllAllocationData not implemented")
}
func (UnimplementedAllocationServiceServer) mustEmbedUnimplementedAllocationServiceServer() {}

// UnsafeAllocationServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AllocationServiceServer will
// result in compilation errors.
type UnsafeAllocationServiceServer interface {
	mustEmbedUnimplementedAllocationServiceServer()
}

func RegisterAllocationServiceServer(s grpc.ServiceRegistrar, srv AllocationServiceServer) {
	s.RegisterService(&AllocationService_ServiceDesc, srv)
}

func _AllocationService_GetAllocationData_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AllocationRequestData)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AllocationServiceServer).GetAllocationData(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/allocation.AllocationService/GetAllocationData",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AllocationServiceServer).GetAllocationData(ctx, req.(*AllocationRequestData))
	}
	return interceptor(ctx, in, info, handler)
}

func _AllocationService_GetAllAllocationData_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AllocationRequestData)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AllocationServiceServer).GetAllAllocationData(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/allocation.AllocationService/GetAllAllocationData",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AllocationServiceServer).GetAllAllocationData(ctx, req.(*AllocationRequestData))
	}
	return interceptor(ctx, in, info, handler)
}

// AllocationService_ServiceDesc is the grpc.ServiceDesc for AllocationService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var AllocationService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "allocation.AllocationService",
	HandlerType: (*AllocationServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAllocationData",
			Handler:    _AllocationService_GetAllocationData_Handler,
		},
		{
			MethodName: "GetAllAllocationData",
			Handler:    _AllocationService_GetAllAllocationData_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "protos/allocation.proto",
}
