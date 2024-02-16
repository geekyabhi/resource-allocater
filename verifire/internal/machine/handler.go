package machine

import (
	"context"
	"encoding/json"
	"fmt"

	pb "github.com/verifire/protos/machine"
)

type Server struct {
	pb.UnimplementedMachineServiceServer
}

func (s *Server) GetMachineData(ctx context.Context, req *pb.MachineRequestData) (*pb.MachineResponseData, error) {
	machineId := req.Data
	fmt.Println(machineId)
	machine, _ := FindMachineByIdService(machineId)
	if machine == nil {
		return &pb.MachineResponseData{Data: ""}, nil
	}
	jsonString, _ := json.Marshal(machine)
	return &pb.MachineResponseData{Data: string(jsonString)}, nil
}
