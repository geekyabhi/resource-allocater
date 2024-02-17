package allocation

import (
	"context"
	"encoding/json"

	pb "github.com/verifire/protos/allocation"
)

type Server struct {
	pb.UnimplementedAllocationServiceServer
}

func (s *Server) GetAllocationData(ctx context.Context, req *pb.AllocationRequestData) (*pb.AllocationResponseData, error) {
	container_id := req.Data
	allocation, _ := FindAllocationByConatinerIdService(container_id)
	if allocation == nil {
		return &pb.AllocationResponseData{Data: ""}, nil
	}
	jsonString, _ := json.Marshal(allocation)
	return &pb.AllocationResponseData{Data: string(jsonString)}, nil
}

func (s *Server) GetAllAllocationData(ctx context.Context, req *pb.AllocationRequestData) (*pb.AllAllocationResponseData, error) {
	uid := req.Data
	allocations, _ := FindAllocationByUIDService(uid)
	if allocations == nil {
		return &pb.AllAllocationResponseData{Data: ""}, nil
	}
	jsonString, _ := json.Marshal(allocations)
	return &pb.AllAllocationResponseData{Data: string(jsonString)}, nil
}
