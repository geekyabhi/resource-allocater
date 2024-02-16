package user

import (
	"context"
	"encoding/json"

	pb "github.com/verifire/protos/user"
)

type Server struct {
	pb.UnimplementedUserServiceServer
}

func (s *Server) GetUserData(ctx context.Context, req *pb.UserRequestData) (*pb.UserResponseData, error) {
	userId := req.Data
	user, _ := FindUserByIdService(userId)
	if user == nil {
		return &pb.UserResponseData{Data: ""}, nil
	}
	jsonString, _ := json.Marshal(user)
	return &pb.UserResponseData{Data: string(jsonString)}, nil
}
